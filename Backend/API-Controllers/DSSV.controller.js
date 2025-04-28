const db = require('../config/db.js');
const jwt = require("jsonwebtoken");

const studentList = async (req, res) => {
    try {
        const authHeader = req.headers.authorization; //lấy token từ header
        console.log("Token nhận được từ client:", authHeader);
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const maGiangVien = decoded.Tai_Khoan;

        console.log("Giáo viên ID:", maGiangVien);

        const [classResult] = await db.query("SELECT Ma_Lop FROM LOP WHERE Co_Van_Hoc_Tap = ?", [maGiangVien]);
        if (classResult.length === 0) {
            console.log("Giáo viên không cố vấn lớp nào!");
            return res.json({ message: "Không có lớp cố vấn" });
        }
        const classId = classResult[0].Ma_Lop;
        console.log("Lớp cố vấn: ", classId);
        // lấy dssv
        const [students] = await db.query("SELECT * FROM SINHVIEN WHERE Ma_Lop = ?", [classId]);
        if (students.length === 0) {
            console.log("Không lấy được dữ liệu sv của lớp đó");
            return;
        }
        return res.json(students);
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
}

module.exports = {studentList};