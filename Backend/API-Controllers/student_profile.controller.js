const db = require('../config/db.js');
const jwt = require("jsonwebtoken");

const profile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization; //lấy token từ header
        console.log("Token nhận được từ client:", authHeader);
        
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

        console.log("Dữ liệu sinh viên:", result[0]);
        return res.json(result[0]);

    } catch (error) {
        console.error("Lỗi xác thực token hoặc truy vấn:", error);
        res.status(401).json({ message: "Token không hợp lệ hoặc truy vấn lỗi!" });
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
            UPDATE SINHVIEN
            SET Ho_Ten = ?, Email_Ca_Nhan = ?, Ngay_Sinh = ?, So_CMND = ?, Ton_Giao = ?, Gioi_Tinh = ?, Thuong_Tru = ?
            WHERE Ma_Sinh_Vien = ?
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
        const [newProfile] = await db.query("SELECT * FROM SINHVIEN WHERE Ma_Sinh_Vien = ?", [userId]);
        return res.json(newProfile[0]);
    }
    catch (error) {
        console.error("Lỗi cập nhật profile:", error);
    }
}

const studentProfileFromTeacher = async (req, res) => {
    try {
        // lấy mssv từ header
        const mssv = req.params.mssv || req.headers['x-student-mssv'];

        
        // sql
        const sql = "SELECT * FROM SINHVIEN WHERE Ma_Sinh_Vien = ?";
        const [result] = await db.query(sql, [mssv]);

        if (result.length === 0) {
            console.log("Không tìm thấy sinh viên!");
            return res.status(404).json({ message: "Không tìm thấy sinh viên!" });
        }

        console.log("Dữ liệu sinh viên:", result[0]);
        return res.json(result[0]);

    }
    catch (error) {
        console.error("Lỗi xác thực token hoặc truy vấn:", error);
        res.status(401).json({ message: "Token không hợp lệ hoặc truy vấn lỗi!" });
    }
}

module.exports = { profile, updateProfile, studentProfileFromTeacher};
// module.exports = { profile, updateProfile};


