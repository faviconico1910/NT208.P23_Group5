const db = require("../config/db.js");
const jwt = require("jsonwebtoken");

const getCompletedCourses = async (req, res) => {
    try {
        // 1. Xác thực token
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(403).json({ 
                success: false,
                message: "Token không hợp lệ!" 
            });
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.Tai_Khoan;
        
        // Tính năm nhập học (ví dụ: MSSV 23012345 -> năm nhập học 2023)
        const admissionYear = 2000 + parseInt(studentId.substring(0, 2));
        const { hocKy, namHoc } = req.query;

        let whereConditions = ["kq.Ma_Sinh_Vien = ?"];
        let queryParams = [studentId];

        // Hàm kiểm tra năm học hợp lệ
        const isValidAcademicYear = (yearStr, admissionYear) => {
            if (!/^\d{4}-\d{4}$/.test(yearStr)) return false;
            const [startYear, endYear] = yearStr.split('-').map(Number);
            return endYear === startYear + 1 && 
                   startYear >= admissionYear && 
                   startYear <= admissionYear + 10; // Giả sử tối đa 10 năm học
        };

        // Xử lý khi có CẢ học kỳ và năm học
        if (hocKy && namHoc) {
            const hocKyNum = parseInt(hocKy);
            const [startYear] = namHoc.split('-').map(Number);
            const expectedHocKy = (startYear - admissionYear) * 2 + hocKyNum;
            
            whereConditions.push("kq.Hoc_Ky = ?");
            queryParams.push(expectedHocKy);
        } 
        // Chỉ có học kỳ
        else if (hocKy) {
            const hocKyNum = parseInt(hocKy);
            if (isNaN(hocKyNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Học kỳ phải là số nguyên dương"
                });
            }
            whereConditions.push("kq.Hoc_Ky = ?");
            queryParams.push(hocKyNum);
        } 
        // Chỉ có năm học
        else if (namHoc) {
            const [startYear] = namHoc.split('-').map(Number);
            const yearOffset = startYear - admissionYear;
            const startHocKy = yearOffset * 2 + 1;
            const endHocKy = yearOffset * 2 + 2;
            
            whereConditions.push(`kq.Hoc_Ky BETWEEN ? AND ?`);
            queryParams.push(startHocKy, endHocKy);
        }

        // Thêm điều kiện chỉ lấy các môn đã có điểm (đã hoàn thành)
        whereConditions.push("kq.Diem_HP IS NOT NULL");

        // Truy vấn SQL
        const [results] = await db.promise().query(`
            SELECT 
                kq.Hoc_Ky,
                mh.Ma_Mon_Hoc, 
                mh.Ten_Mon_Hoc,
                mh.Tin_chi_LT,
                mh.Tin_chi_TH,
                (mh.Tin_chi_LT + IFNULL(mh.Tin_chi_TH, 0)) AS So_TC,
                kq.Diem_QT,
                kq.Diem_GK,
                kq.Diem_TH,
                kq.Diem_CK,
                kq.Diem_HP,
                CASE
                    WHEN kq.Diem_HP >= 8.5 THEN 'A'
                    WHEN kq.Diem_HP >= 8.0 THEN 'B+'
                    WHEN kq.Diem_HP >= 7.0 THEN 'B'
                    WHEN kq.Diem_HP >= 6.5 THEN 'C+'
                    WHEN kq.Diem_HP >= 5.5 THEN 'C'
                    WHEN kq.Diem_HP >= 5.0 THEN 'D+'
                    ELSE 'F'
                END AS Xep_Loai,
                kq.GHI_CHU,
                CONCAT(
                    ${admissionYear} + FLOOR((kq.Hoc_Ky-1)/2), 
                    '-', 
                    ${admissionYear} + FLOOR((kq.Hoc_Ky-1)/2) + 1
                ) AS Nam_Hoc
            FROM KETQUA kq
            JOIN MONHOC mh ON kq.Ma_Mon_Hoc = mh.Ma_Mon_Hoc
            WHERE ${whereConditions.join(' AND ')}
            ORDER BY kq.Hoc_Ky DESC, mh.Ten_Mon_Hoc ASC
        `, queryParams);

        // Xử lý kết quả
        const processedResults = results.map(item => ({
            ...item,
            Nam_Hoc: calculateAcademicYear(item.Hoc_Ky, admissionYear),
            Xep_Loai: item.Xep_Loai || calculateGrade(item.Diem_HP),
            So_TC: item.So_TC || 0
        }));

        // Tính toán thống kê
        const stats = {
            tongMon: processedResults.length,
            tongTC: processedResults.reduce((sum, item) => sum + (item.So_TC || 0), 0),
            diemTB: processedResults.length > 0 
                ? parseFloat((processedResults.reduce((sum, item) => sum + (item.Diem_HP || 0), 0) / processedResults.length).toFixed(2))
                : 0
        };

        // Tạo message tùy theo điều kiện lọc
        let message = "Lấy dữ liệu thành công";
        if (hocKy && namHoc) {
            const [startYear] = namHoc.split('-');
            const hocKyNum = (parseInt(startYear) - admissionYear) * 2 + parseInt(hocKy);
            message = `Dữ liệu học kỳ ${hocKyNum} (${hocKy} năm học ${namHoc})`;
        } else if (hocKy) {
            message = `Dữ liệu học kỳ ${hocKy}`;
        } else if (namHoc) {
            message = `Dữ liệu năm học ${namHoc}`;
        }

        res.json({
            success: true,
            message: message,
            data: processedResults,
            stats: stats,
            metadata: {
                studentId: studentId,
                hocKy: hocKy || "Tất cả",
                namHoc: namHoc || "Tất cả",
                admissionYear: admissionYear
            }
        });

    } catch (error) {
        console.error("Lỗi chi tiết:", {
            message: error.message,
            stack: error.stack,
            sql: error.sql
        });

        res.status(500).json({ 
            success: false,
            message: "Lỗi server",
            error: error.message 
        });
    }
};

function calculateAcademicYear(hocKy, admissionYear) {
    const yearOffset = Math.floor((hocKy - 1) / 2);
    const startYear = admissionYear + yearOffset;
    return `${startYear}-${startYear + 1}`;
}

function calculateGrade(diemHP) {
    if (diemHP >= 8.5) return 'A';
    if (diemHP >= 8.0) return 'B+';
    if (diemHP >= 7.0) return 'B';
    if (diemHP >= 6.5) return 'C+';
    if (diemHP >= 5.5) return 'C';
    if (diemHP >= 5.0) return 'D+';
    return 'F';
}

module.exports = { getCompletedCourses };