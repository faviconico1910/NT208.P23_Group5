const db = require('../config/db.js');
const jwt = require('jsonwebtoken');

const teacher_profile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Token nhận được", authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }
        // get token
        const token = authHeader.split(" ")[1];
        // decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan; // Mã giảng viên hoặc sinh viên

        console.log("Id từ token: ", userId);
        
        // query 
        const sql = "SELECT * FROM GIANGVIEN WHERE Ma_Giang_Vien = ?";
        const [result] = await db.query(sql, [userId]);
            if (result.length === 0) {
                console.log("Không tìm thấy giảng viên!");
                return res.status(404).json({ message: "Không tìm thấy giảng viên!" });
            }
            console.log("Dữ liệu giảng viên:", result[0]);
            res.json(result[0]);
    }
    catch (error) {
        console.error("Lỗi xác thực token:", error);
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
};
const updateProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization; //lấy token từ header
        console.log("Token nhận được từ client:", authHeader);
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }       
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan; // lấy Tai_Khoan từ token

        console.log("Nhận PUT update_profile với id từ token:", userId);
        const {
            Ho_Ten,
            Email_Ca_Nhan,
            Ngay_Sinh,
            So_CMND,
            Ton_Giao,
            Gioi_Tinh,
            Thuong_Tru
        } = req.body;
        const ngaySinhFormatted = Ngay_Sinh ? new Date(Ngay_Sinh).toISOString().split('T')[0] : null;
        const sql = `
            UPDATE GIANGVIEN
            SET Ho_Ten = ?, Email_Ca_Nhan = ?, Ngay_Sinh = ?, So_CMND = ?, Ton_Giao = ?, Gioi_Tinh = ?, Thuong_Tru = ?
            WHERE Ma_Giang_Vien = ?
        `;
        const [result] = await db.query(sql, [
            Ho_Ten,
            Email_Ca_Nhan,
            ngaySinhFormatted,
            So_CMND,
            Ton_Giao,
            Gioi_Tinh,
            Thuong_Tru,
            userId
        ]);
        
        console.log("Kết quả cập nhật:", result);
        // trả về client
        const [newProfile] = await db.query("SELECT * FROM GIANGVIEN WHERE Ma_Giang_Vien = ?", [userId]);
        return res.json(newProfile[0]);
    }
    catch (error) {
        console.error("Lỗi cập nhật profile:", error);
        res.status(500).json({ message: "Có lỗi khi cập nhật hồ sơ!" });
    }
}
module.exports = {teacher_profile, updateProfile};