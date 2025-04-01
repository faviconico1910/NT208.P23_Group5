const db = require('../config/db.js');
const jwt = require('jsonwebtoken');

const teacher_profile = async(req, res) => {
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
        db.query(sql, [userId], (err, result) => {
            if (err) {
                console.error("❌ Lỗi truy vấn SQL:", err);
                return res.status(500).json({ message: "Lỗi server!", error: err });
            }
            if (result.length === 0) {
                console.log("❌ Không tìm thấy giảng viên!");
                return res.status(404).json({ message: "Không tìm thấy giảng viên!" });
            }
            console.log("✅ Dữ liệu giảng viên:", result[0]);
            res.json(result[0]);
        });
    }
    catch (error) {
        console.error("❌ Lỗi xác thực token:", error);
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
};

module.exports = {teacher_profile};