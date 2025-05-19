const express = require("express");
const router = express.Router();
const path = require("path");
const authenticateAdmin = require("../API-Controllers/admin.controller.js");
const { getSystemStats } = require('../API-Controllers/adminstatus.controller.js');
const db = require("../config/db.js");

// Route chính - phục vụ file HTML (KHÔNG áp dụng middleware ở đây)
router.get("/", (req, res) => {
    // Gửi file HTML trước, sau đó client sẽ tự gọi API với token
    res.sendFile(path.join(__dirname, "../../Frontend/admin/dashboard.html"));
});

// Các API yêu cầu xác thực
router.get("/dashboard", authenticateAdmin, (req, res) => {
    res.json({
        message: "Chào mừng admin!",
        adminInfo: req.admin
    });
});
router.get('/stats', getSystemStats);


// API Users-----------------------------
router.post("/users", authenticateAdmin, async (req, res) => {
    try {
        const { userType, username, password } = req.body;
        
        // Kiểm tra email đã tồn tại chưa
        const [existingUser] = await db.promise().query(
            "SELECT * FROM USER WHERE Tai_Khoan = ?", 
            [username]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Tài khoản đã được sử dụng"
            });
        }
        
        // Thêm người dùng vào database
        await db.promise().query(
            "INSERT INTO USER (Tai_Khoan, Mat_Khau, Vai_Tro) VALUES (?, ?, ?)",
            [ username, password, userType === 'SinhVien' ? 'SinhVien' : 'GiangVien']
        );
        
        res.json({
            success: true,
            message: "Thêm người dùng thành công",
            data: { username }
        });
    } catch (error) {
        console.error("Lỗi khi thêm người dùng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
});


//Thêm lớp học
router.post("/classes", authenticateAdmin, async (req, res) => {
    try {
        const { Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap } = req.body;
        
        // Kiểm tra lớp đã tồn tại chưa
        const [existingClass] = await db.promise().query(
            "SELECT * FROM LOP WHERE Ma_Lop = ?", 
            [Ma_Lop]
        );
        
        if (existingClass.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Mã lớp đã tồn tại"
            });
        }
        
        const [unexisting] = await db.promise().query(
            "SELECT * FROM GiangVien WHERE Ma_Giang_Vien = ?", 
            [Co_Van_Hoc_Tap]
        );
        if (unexisting.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Giáo viên chưa tồn tại"
            });
        }
        
        // Thêm lớp học vào database
        await db.promise().query(
            "INSERT INTO LOP (Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap) VALUES (?, ?, ?, ?)",
            [Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap]
        );
        
        res.json({
            success: true,
            message: "Tạo lớp học thành công",
            data: { Ma_Lop, Ten_Lop }
        });
    } catch (error) {
        console.error("Lỗi khi tạo lớp học:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
});
module.exports = router;