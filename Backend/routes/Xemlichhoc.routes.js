const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "../uploads_calendar");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Cấu hình multer để lưu file theo MSSV (id user từ token)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const userId = req.userId;
        cb(null, `${userId}_scheduled.ics`);
    }
});
const upload = multer({ storage });

/**
 * ✅ Middleware xác thực JWT thủ công (giống ví dụ bạn đưa)
 */
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.Tai_Khoan; // giống bạn dùng `Tai_Khoan`
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
}

// Gửi file xemlichhoc.html khi truy cập /xemlichhoc
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/Xemlichhoc/xemlichhoc.html'));
});

// 🔹 POST /ics/upload: upload file ics
router.post("/upload", authenticateJWT, upload.single("icsFile"), (req, res) => {
    return res.json({ message: "Upload file .ics thành công" });
});

// 🔹 GET /ics/me: lấy file ics đã upload
router.get("/get", authenticateJWT, (req, res) => {
    const userId = req.userId;
    const filePath = path.join(uploadDir, `${userId}_scheduled.ics`);
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        return res.status(404).json({ message: "Chưa có file .ics được upload" });
    }
});

// 🔹 DELETE /ics/me: xóa file .ics nếu cần
router.delete("/delete", authenticateJWT, (req, res) => {
    const userId = req.userId;
    const filePath = path.join(uploadDir, `${userId}_scheduled.ics`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ message: "Xóa file .ics thành công" });
    } else {
        return res.status(404).json({ message: "Không tìm thấy file để xóa" });
    }
});

module.exports = router;
