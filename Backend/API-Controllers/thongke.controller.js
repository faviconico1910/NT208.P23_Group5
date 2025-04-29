const db = require('../config/db.js'); 
const path = require("path");
const jwt = require("jsonwebtoken");

const getGPAPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/ThongKe/ThongKe.html"));
};

const getGPAList = async (req, res) => {
    try {
        const authHeader = req.headers.authorization; //lấy token từ header
        console.log("📌 Token nhận được từ client:", authHeader);
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        const userId = decoded.Tai_Khoan;  // MSSV lấy từ token

        console.log("📩 MSGV từ token:", userId);

        if (!userId) {
            return res.status(400).json({ error: "Mã sinh viên không hợp lệ hoặc chưa đăng nhập" });
        }

        // Lấy thông tin sinh viên của lớp: năm nhập học
        const [[studentInfo]] = await db.query(`
            SELECT Nam_Nhap_Hoc
            FROM SINHVIEN sv
            JOIN LOP l on sv.Ma_Lop = l.Ma_Lop
            WHERE Co_Van_Hoc_Tap = ?
            LIMIT 1
        `, [userId]);

        if (!studentInfo) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sinh viên"
            });
        }

        const { Nam_Nhap_Hoc } = studentInfo;
        const { hocKy, namHoc } = req.query;

        let whereConditions = ["Co_Van_Hoc_Tap = ?"];
        let queryParams = [userId];

        if (hocKy && namHoc) {
            const hocKyNum = parseInt(hocKy);
            const [startYear] = namHoc.split('-').map(Number);
            const expectedHocKy = (startYear - Nam_Nhap_Hoc) * 2 + hocKyNum;
            whereConditions.push("Hoc_Ky = ?");
            queryParams.push(expectedHocKy);
        } else if (hocKy) {
            whereConditions.push("Hoc_Ky = ?");
            queryParams.push(parseInt(hocKy));
        } else if (namHoc) {
            const [startYear] = namHoc.split('-').map(Number);
            const yearOffset = startYear - Nam_Nhap_Hoc;
            const startHocKy = yearOffset * 2 + 1;
            const endHocKy = yearOffset * 2 + 2;
            whereConditions.push(`Hoc_Ky BETWEEN ? AND ?`);
            queryParams.push(startHocKy, endHocKy);
        }

        // Query chính - thông tin sinh viên và GPA tổng
        const query = `
            WITH MONHOC_ALL AS (
                SELECT 
                    Ma_Mon_Hoc, Tin_chi_LT, Tin_chi_TH, Ma_Nganh, Khoa
                FROM MONHOC
                UNION ALL
                SELECT 
                    Ma_Mon_Hoc, Tin_chi_LT, Tin_chi_TH, Ma_Nganh, Khoa
                FROM MONHOC_KHAC
            )

            SELECT 
                lop.Ma_Lop, 
                sv.Ma_Sinh_Vien,
                ROUND(SUM(kq.Diem_HP * (mh.Tin_chi_LT + mh.Tin_chi_TH)) / SUM(mh.Tin_chi_LT + mh.Tin_chi_TH), 2) AS GPA,
                SUM(mh.Tin_chi_LT + mh.Tin_chi_TH) AS Tong_Tin_Chi
            FROM KETQUA kq
            JOIN SINHVIEN sv ON kq.Ma_Sinh_Vien = sv.Ma_Sinh_Vien
            JOIN LOP lop ON sv.Ma_Lop = lop.Ma_Lop
            JOIN MONHOC_ALL mh 
                ON kq.Ma_Mon_Hoc = mh.Ma_Mon_Hoc
                AND mh.Ma_Nganh = sv.Ma_Nganh
                AND mh.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
            WHERE ${whereConditions.join(' AND ')}
            GROUP BY sv.Ma_Sinh_Vien, lop.Ma_Lop
            ORDER BY GPA DESC;
        `;

        // Query thêm - GPA theo từng học kỳ
        const semesterQuery = `
            WITH MONHOC_ALL AS (
                SELECT 
                    Ma_Mon_Hoc, Tin_chi_LT, Tin_chi_TH, Ma_Nganh, Khoa
                FROM MONHOC
                UNION ALL
                SELECT 
                    Ma_Mon_Hoc, Tin_chi_LT, Tin_chi_TH, Ma_Nganh, Khoa
                FROM MONHOC_KHAC
            )

            SELECT 
                kq.Hoc_Ky,
                ROUND(AVG(ROUND(SUM(kq.Diem_HP * (mh.Tin_chi_LT + mh.Tin_chi_TH)) / SUM(mh.Tin_chi_LT + mh.Tin_chi_TH), 2)) OVER (PARTITION BY kq.Hoc_Ky), 2) AS GPA_Trung_Binh
            FROM KETQUA kq
            JOIN SINHVIEN sv ON kq.Ma_Sinh_Vien = sv.Ma_Sinh_Vien
            JOIN LOP lop ON sv.Ma_Lop = lop.Ma_Lop
            JOIN MONHOC_ALL mh 
                ON kq.Ma_Mon_Hoc = mh.Ma_Mon_Hoc
                AND mh.Ma_Nganh = sv.Ma_Nganh
                AND mh.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
            WHERE Co_Van_Hoc_Tap = ?
            GROUP BY kq.Hoc_Ky, sv.Ma_Sinh_Vien
            ORDER BY kq.Hoc_Ky;
        `;

        const drlQuery = `
            SELECT 
                sv.Ma_Sinh_Vien,
                AVG(drl.Diem_Ren_Luyen) AS Diem_Ren_Luyen  -- Lấy điểm trung bình nếu có nhiều bản ghi
            FROM DIEMRL drl 
            JOIN SINHVIEN sv ON sv.Ma_Sinh_Vien = drl.Ma_Sinh_Vien
            JOIN LOP l ON l.Ma_Lop = sv.Ma_Lop
            WHERE ${whereConditions.join(' AND ')}
            GROUP BY sv.Ma_Sinh_Vien
        `; 

        const [queryData] = await db.query(query, [...queryParams]);
        const [semesterData] = await db.query(semesterQuery, [userId]);
        const [drlData] = await db.query(drlQuery, [...queryParams]);

        // Xử lý dữ liệu học kỳ để loại bỏ các bản ghi trùng lặp
        const uniqueSemesterData = [];
        const seenSemesters = new Set();
        
        for (const item of semesterData) {
            if (!seenSemesters.has(item.Hoc_Ky)) {
                seenSemesters.add(item.Hoc_Ky);
                uniqueSemesterData.push(item);
            }
        }

        return res.json({
            query: queryData,
            semesterData: uniqueSemesterData,
            drlData : drlData
        });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ error: "Lỗi máy chủ!", message: error.message });
    }
};

module.exports = { getGPAList, getGPAPage };