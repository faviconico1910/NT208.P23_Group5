const db = require('../config/db.js');
const path = require("path");
const jwt = require("jsonwebtoken");

const getDeXuatPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/DeXuat/DeXuat.html"));
};

// Hàm lấy danh sách môn học đề xuất
const getMonHocTongHop = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(403).json({ 
                success: false,
                message: "Token không hợp lệ!" 
            });
        }

        const token = authHeader.split(" ")[1];
        
        // Thêm try-catch để xử lý lỗi verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error("Lỗi xác thực token:", err);
            return res.status(401).json({ 
                success: false,
                message: "Token không hợp lệ hoặc đã hết hạn!" 
            });
        }

        const userId = decoded.Tai_Khoan;
        console.log("📩 MSSV từ token:", userId);

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                message: "Mã sinh viên không hợp lệ hoặc chưa đăng nhập" 
            });
        }

        // Query cải tiến với xử lý học kỳ tốt hơn
        const deXuatQuery = `
            SELECT 
                mh.Ma_Mon_Hoc, 
                mh.Ten_Mon_Hoc, 
                mh.Tin_chi_LT, 
                mh.Tin_chi_TH, 
                mh.Ma_Mon_Tien_Quyet
            FROM MONHOC mh
            JOIN SINHVIEN sv ON sv.Ma_Nganh = mh.Ma_Nganh
            WHERE sv.Ma_Sinh_Vien = ?
            AND mh.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
            AND mh.Hoc_Ki = IFNULL(
                (
                    SELECT MAX(kq.Hoc_Ky) + 1
                    FROM KETQUA kq
                    WHERE kq.Ma_Sinh_Vien = sv.Ma_Sinh_Vien
                    GROUP BY kq.Ma_Sinh_Vien
                ),
                1  -- Mặc định học kỳ 1 nếu không tìm thấy kết quả
            )
            AND mh.Ma_Mon_Hoc NOT IN (
                SELECT kq.Ma_Mon_Hoc
                FROM KETQUA kq
                WHERE kq.Ma_Sinh_Vien = sv.Ma_Sinh_Vien
            );
        `;
        const [deXuatData] = await db.query(deXuatQuery, [userId]);

        const hocLaiQuery = `
                SELECT 
                    COALESCE(mh.Ma_Mon_Hoc, mhk.Ma_Mon_Hoc) AS Ma_Mon_Hoc,
                    COALESCE(mh.Ten_Mon_Hoc, mhk.Ten_Mon_Hoc) AS Ten_Mon_Hoc,
                    COALESCE(mh.Tin_chi_LT, mhk.Tin_chi_LT) AS Tin_chi_LT,
                    COALESCE(mh.Tin_chi_TH, mhk.Tin_chi_TH) AS Tin_chi_TH,
                    mh.Ma_Mon_Tien_Quyet
                FROM KETQUA kq
                JOIN SINHVIEN sv ON kq.Ma_Sinh_Vien = sv.Ma_Sinh_Vien
                LEFT JOIN MONHOC mh 
                    ON mh.Ma_Mon_Hoc = kq.Ma_Mon_Hoc 
                    AND mh.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
                    AND mh.Ma_Nganh = sv.Ma_Nganh
                LEFT JOIN MONHOC_Khac mhk 
                    ON mhk.Ma_Mon_Hoc = kq.Ma_Mon_Hoc 
                    AND mhk.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
                    AND mhk.Ma_Nganh = sv.Ma_Nganh
                WHERE kq.GHI_CHU = 'Khong dat'
                AND kq.Ma_Sinh_Vien = ?
        `;
        
        const [hocLaiData] = await db.query(hocLaiQuery, [userId]);

        const chuyenNganhQuery = `
                SELECT Ma_Mon_Hoc, Ten_Mon_Hoc, Tin_chi_LT, Tin_chi_TH
                FROM MONHOC_KHAC mhk
                JOIN SINHVIEN sv ON sv.Ma_Nganh = mhk.Ma_Nganh and mhk.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
                WHERE Ma_Sinh_Vien = ? and Loai = 'chuyên ngành';
        `;
        
        const [chuyenNganhData] = await db.query(chuyenNganhQuery, [userId]);

        const tuChonQuery = `
                SELECT Ma_Mon_Hoc, Ten_Mon_Hoc, Tin_chi_LT, Tin_chi_TH
                FROM MONHOC_KHAC mhk
                JOIN SINHVIEN sv ON sv.Ma_Nganh = mhk.Ma_Nganh and mhk.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
                WHERE Ma_Sinh_Vien = ? and Loai = 'tự chọn';
        `;
        
        const [tuchonData] = await db.query(tuChonQuery, [userId]);

        const chuyenDeQuery = `
                SELECT Ma_Mon_Hoc, Ten_Mon_Hoc, Tin_chi_LT, Tin_chi_TH
                FROM MONHOC_KHAC mhk
                JOIN SINHVIEN sv ON sv.Ma_Nganh = mhk.Ma_Nganh and mhk.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
                WHERE Ma_Sinh_Vien = ? and Loai = 'chuyên đề';
        `;
        
        const [chuyenDeData] = await db.query(chuyenDeQuery, [userId]);

        return res.json({
            de_xuat: deXuatData,
            hoc_lai: hocLaiData,
            chuyen_nganh: chuyenNganhData,
            tu_chon: tuchonData,
            chuyen_de: chuyenDeData
        });
    
    } catch (err) {
        console.error("Lỗi xử lý:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }

}

module.exports = { getDeXuatPage, getMonHocTongHop };