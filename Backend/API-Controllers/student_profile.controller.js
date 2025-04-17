    const db = require('../config/db.js');
    const jwt = require("jsonwebtoken");

    const profile = async (req, res) => {
        try {
            const authHeader = req.headers.authorization; //lấy token từ header
            console.log("📌 Token nhận được từ client:", authHeader);
            
            if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
                return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
            }
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.Tai_Khoan;  // MSSV lấy từ token

            console.log(" Nhận request student_profile với id từ token:", userId);

            const sql = "SELECT * FROM SINHVIEN WHERE Ma_Sinh_Vien = ?";
            const [result] = await db.query(sql, [userId]);
    
            if (result.length === 0) {
                console.log("Không tìm thấy sinh viên!");
                return res.status(404).json({ message: "Không tìm thấy sinh viên!" });
            }
    
            console.log("✅ Dữ liệu sinh viên:", result[0]);
            res.json(result[0]);
    
        } catch (error) {
            console.error("❌ Lỗi xác thực token hoặc truy vấn:", error);
            res.status(401).json({ message: "Token không hợp lệ hoặc truy vấn lỗi!" });
        }
    };

    module.exports = { profile };
