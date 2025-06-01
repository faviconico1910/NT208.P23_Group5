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

const Xem_lich_hoc_current = async (req, res) => {
    try {
        console.log("✅ Đã vào route /xemlichhoc/api/current");

        const hocKi = req.query.hocKi;
        const mssv = req.params.mssv || req.headers['x-student-mssv'];

        console.log("📩 Nhận request với mssv:", mssv, "và học kỳ:", hocKi);

        // Kiểm tra quyền truy cập
        if (req.decodedToken.Vai_Tro === 'SinhVien' && req.decodedToken.Tai_Khoan !== mssv) {
            return res.status(403).json({ message: "Bạn không có quyền xem lịch học của sinh viên khác" });
        }

        // Nếu là giảng viên, kiểm tra xem có quyền xem lịch sinh viên này không
        if (req.decodedToken.role === 'GiangVien') {
            // Có thể thêm logic kiểm tra giảng viên có dạy sinh viên này không
        }

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

        const [result] = await db.query(sql, [mssv, hocKi]);
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
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Token không hợp lệ!" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;
        const userRole = decoded.Vai_Tro; // Giả sử trường vai trò là VaiTro trong token

        // Xác định MSSV cần truy vấn
        let mssvToQuery;
        if (userRole === 'SinhVien') {
            mssvToQuery = userId;
        } else if (userRole === 'GiangVien') {
            // Lấy MSSV từ header nếu có (được gửi từ frontend)
            mssvToQuery = req.headers['x-student-mssv'];
            
            if (!mssvToQuery) {
                return res.status(400).json({ 
                    message: "Vui lòng chọn sinh viên từ trang hồ sơ trước khi xem lịch học" 
                });
            }
        } else {
            return res.status(403).json({ message: "Vai trò không hợp lệ!" });
        }

        console.log(`Truy vấn học kỳ cho sinh viên: ${mssvToQuery}`);

        const [result] = await db.query(`
            SELECT DISTINCT DK.Hoc_Ki 
            FROM DANGKY DK 
            WHERE DK.Ma_Sinh_Vien = ? 
            ORDER BY DK.Hoc_Ki DESC
        `, [mssvToQuery]);

        console.log(`Kết quả truy vấn: ${JSON.stringify(result)}`);

        if (result.length === 0) {
            console.warn(`Không tìm thấy học kỳ nào cho sinh viên ${mssvToQuery}`);
            return res.json([]); // Trả về mảng rỗng thay vì lỗi
        }

        return res.json(result);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách học kỳ:", error);
        return res.status(500).json({ 
            message: "Lỗi server",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Thêm export function mới
module.exports = { 
  Xem_lich_hoc_page, 
  Xem_lich_hoc, 
  Lay_danh_sach_hoc_ki,
  Xem_lich_hoc_current 
};