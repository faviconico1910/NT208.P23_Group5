// admin.routes.js (hoặc file xử lý routes tương ứng)
const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const authenticateAdmin = require("../API-Controllers/admin.controller.js");

// Lấy danh sách người dùng
router.get("/users", authenticateAdmin, async (req, res) => {
    try {
        const [users] = await db.query("SELECT Tai_Khoan, Vai_Tro FROM USER");
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// Sửa thông tin người dùng
router.put("/users/:username", authenticateAdmin, async (req, res) => {
    try {
        const { username } = req.params;
        const { password } = req.body;

        // Cập nhật mật khẩu (bạn nên mã hóa password trước khi lưu vào DB)
        await db.query(
            "UPDATE USER SET Mat_Khau = ? WHERE Tai_Khoan = ?",
            [password, username] //  Mã hóa password trước khi truyền vào đây
        );

        res.json({
            success: true,
            message: "Cập nhật thành công"
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// Xóa người dùng
router.delete("/users/:username", authenticateAdmin, async (req, res) => {
    try {
        const { username } = req.params;

        await db.query(
            "DELETE FROM USER WHERE Tai_Khoan = ?",
            [username]
        );

        res.json({
            success: true,
            message: "Xóa thành công"
        });
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});
module.exports = router;
