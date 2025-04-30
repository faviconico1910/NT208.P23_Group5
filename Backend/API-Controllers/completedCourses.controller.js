const db = require("../config/db.js");
const jwt = require("jsonwebtoken");

const getCompletedCourses = async (req, res) => {
    try {
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

        // Lấy thông tin sinh viên: năm nhập học, mã ngành
        const [[studentInfo]] = await db.query(`
            SELECT Nam_Nhap_Hoc, Ma_Nganh
            FROM SINHVIEN
            WHERE Ma_Sinh_Vien = ?
        `, [studentId]);

        if (!studentInfo) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sinh viên"
            });
        }

        const { Nam_Nhap_Hoc, Ma_Nganh } = studentInfo;
        const Khoa = `K${Nam_Nhap_Hoc - 2005}`; // vì K19 → 2024, tức 2005 + 19

        const { hocKy, namHoc } = req.query;

        let whereConditions = ["kq.Ma_Sinh_Vien = ?"];
        let queryParams = [studentId];

        if (hocKy && namHoc) {
            const hocKyNum = parseInt(hocKy);
            const [startYear] = namHoc.split('-').map(Number);
            const expectedHocKy = (startYear - Nam_Nhap_Hoc) * 2 + hocKyNum;
            whereConditions.push("kq.Hoc_Ky = ?");
            queryParams.push(expectedHocKy);
        } else if (hocKy) {
            whereConditions.push("kq.Hoc_Ky = ?");
            queryParams.push(parseInt(hocKy));
        } else if (namHoc) {
            const [startYear] = namHoc.split('-').map(Number);
            const yearOffset = startYear - Nam_Nhap_Hoc;
            const startHocKy = yearOffset * 2 + 1;
            const endHocKy = yearOffset * 2 + 2;
            whereConditions.push(`kq.Hoc_Ky BETWEEN ? AND ?`);
            queryParams.push(startHocKy, endHocKy);
        }

        whereConditions.push("kq.Diem_HP IS NOT NULL");
        
        const [results] = await db.query(`
            SELECT 
                kq.Hoc_Ky,
                dk.Ma_Mon_Hoc,
                CASE 
                    WHEN dk.LOAI = 'chinh' THEN mh.Ten_Mon_Hoc
                    ELSE mhk.Ten_Mon_Hoc
                END AS Ten_Mon_Hoc,
                CASE 
                    WHEN dk.LOAI = 'chinh' THEN (mh.Tin_chi_LT + IFNULL(mh.Tin_chi_TH, 0))
                    ELSE (mhk.Tin_Chi_LT + IFNULL(mhk.Tin_Chi_TH, 0))
                END AS So_TC,
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
                    ${Nam_Nhap_Hoc} + FLOOR((kq.Hoc_Ky-1)/2), 
                    '-', 
                    ${Nam_Nhap_Hoc} + FLOOR((kq.Hoc_Ky-1)/2) + 1
                ) AS Nam_Hoc
            FROM KETQUA kq
            JOIN DANGKY dk ON kq.Ma_Mon_Hoc = dk.Ma_Mon_Hoc AND dk.Ma_Sinh_Vien = kq.Ma_Sinh_Vien
            LEFT JOIN MONHOC mh ON dk.LOAI = 'chinh' AND mh.Ma_Mon_Hoc = dk.Ma_Mon_Hoc AND mh.Ma_Nganh = ? AND mh.Khoa = ?
            LEFT JOIN MONHOC_KHAC mhk ON dk.LOAI = 'khac' AND mhk.Ma_Mon_Hoc = dk.Ma_Mon_Hoc AND mhk.Ma_Nganh = ? AND mhk.Khoa = ?
            WHERE ${whereConditions.join(' AND ')} 
            ORDER BY kq.Hoc_Ky DESC, Ten_Mon_Hoc ASC
        `, [Ma_Nganh, Khoa, Ma_Nganh, Khoa,...queryParams ]);

        console.log("Query params:", queryParams);
        console.log("Final params:", [Ma_Nganh, Khoa, Ma_Nganh, Khoa,...queryParams]);
        console.log("Khoa:", Khoa, "Ma_Nganh:", Ma_Nganh);

        console.log("Số lượng kết quả:", results.length);
        if (results.length === 0) {
            console.log("Không có kết quả nào từ query. Có thể do JOIN sai Khoa hoặc Ma_Nganh.");
        }
        const processedResults = results.map(item => ({
            ...item,
            So_TC: item.So_TC || 0
        }));

        const stats = {
            tongMon: processedResults.length,
            tongTC: processedResults.reduce((sum, item) => sum + (item.So_TC || 0), 0),
            diemTB: processedResults.length > 0 
                ? parseFloat((processedResults.reduce((sum, item) => sum + (item.Diem_HP || 0), 0) / processedResults.length).toFixed(2))
                : 0
        };

        let message = "Lấy dữ liệu thành công";
        if (hocKy && namHoc) {
            message = `Dữ liệu học kỳ ${hocKy} năm học ${namHoc}`;
        } else if (hocKy) {
            message = `Dữ liệu học kỳ ${hocKy}`;
        } else if (namHoc) {
            message = `Dữ liệu năm học ${namHoc}`;
        }

        res.json({
            success: true,
            message,
            data: processedResults,
            stats,
            metadata: {
                studentId,
                Ma_Nganh,
                Khoa,
                Nam_Nhap_Hoc,
                hocKy: hocKy || "Tất cả",
                namHoc: namHoc || "Tất cả"
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

module.exports = { getCompletedCourses };
