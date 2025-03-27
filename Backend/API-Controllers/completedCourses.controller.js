const db = require("../config/db.js"); //Import file db.js để sử dụng kết nối MySQL.
const jwt = require("jsonwebtoken"); //Import thư viện jsonwebtoken để xác thực token.

//Tạo một hàm bất đồng bộ (async) để xử lý yêu cầu lấy danh sách môn học đã hoàn thành.
const getCompletedCourses = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("📌 Token nhận được từ client:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) { 
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenUserId = decoded.Tai_Khoan;  // MSSV lấy từ token
        
        // 🔥 Lấy studentId từ query parameters nếu có, nếu không thì lấy từ token
        const studentId = req.query.studentId || tokenUserId;
        console.log("📩 Nhận request completedCourses với studentId:", studentId);

        // Truy vấn SQL
        const sql = `
        SELECT mh.Ma_Mon_Hoc, mh.Ten_Mon_Hoc, kq.Diem_HP
        FROM KETQUA kq
        JOIN MONHOC mh ON kq.Ma_Mon_Hoc = mh.Ma_Mon_Hoc
        WHERE kq.Ma_Sinh_Vien = ? AND kq.Diem_HP >= 5`;

        db.query(sql, [studentId], (err, result) => {
            if (err) {
                console.error("Lỗi truy vấn SQL:", err);
                return res.status(500).json({ message: "Lỗi server!", error: err });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: "Sinh viên chưa hoàn thành môn học nào!" });
            }
            res.json(result);
        });
    } catch (error) {
        console.error("❌ Lỗi xác thực token:", error);
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
};


module.exports = { getCompletedCourses };
