const path = require('path');
const jwt = require("jsonwebtoken");
const db = require('../config/db.js');

// Load trang xem lịch học
const Xem_lich_hoc_page = (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/Xemlichhoc/xemlichhoc.html'));
};

// API lấy dữ liệu lịch học theo học kỳ
const Xem_lich_hoc = async (req, res) => {
    try {
        console.log("✅ Đã vào route /xemlichhoc/api");

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;

        const hocKi = req.query.hocKi; // <-- lấy học kỳ từ query string
        console.log("📩 Nhận request với id:", userId, "và học kỳ:", hocKi);

        const sql = `
        SELECT LH.Ma_Lop_Hoc, LH.Thu, LH.Tiet_Bat_Dau, LH.Tiet_Ket_Thuc, MH.Ten_Mon_Hoc, DK.Hoc_Ki
        FROM DANGKY DK
        JOIN LICHHOC LH ON DK.Ma_Lop_Hoc = LH.Ma_Lop_Hoc
        JOIN MONHOC MH ON DK.Ma_Mon_Hoc = MH.Ma_Mon_Hoc
        WHERE DK.Ma_Sinh_Vien = ?
        AND MH.Hoc_Ki = ?
        AND LH.Tiet_Bat_Dau IS NOT NULL
        AND LH.Tiet_Ket_Thuc IS NOT NULL
        ORDER BY LH.Thu ASC, LH.Tiet_Bat_Dau ASC`;

        const [result] = await db.query(sql, [userId, hocKi]);
        console.log("✅ Truy vấn thành công:", result);
        return res.json(result);

    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);
        return res.status(500).json({ message: "Lỗi xử lý phía server!" });
    }
};

// API lấy danh sách học kỳ
const Lay_danh_sach_hoc_ki = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;

        const sql = `
        SELECT DISTINCT DK.Hoc_Ki
        FROM DANGKY DK
        WHERE DK.Ma_Sinh_Vien = ?
        ORDER BY DK.Hoc_Ki DESC`;

        const [result] = await db.query(sql, [userId]);
        console.log("✅ Truy vấn danh sách học kỳ thành công:", result);
        return res.json(result);

    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);
        return res.status(500).json({ message: "Lỗi xử lý phía server!" });
    }
};

module.exports = { Xem_lich_hoc_page, Xem_lich_hoc, Lay_danh_sach_hoc_ki };
