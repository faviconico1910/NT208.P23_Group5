const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require('jsonwebtoken'); 
const { 
    getCompletedCourses, 
    getCompletedCoursesByMSSV 
} = require("../API-Controllers/completedCourses.controller");

// Middleware đơn giản chỉ kiểm tra token hợp lệ
const checkValidToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET); // Chỉ verify token
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};

// API lấy kết quả theo token (sinh viên tự xem)
router.get("/api", getCompletedCourses);

// API lấy kết quả theo MSSV (bỏ kiểm tra quyền)
router.get("/api/:mssv", checkValidToken, getCompletedCoursesByMSSV);

// Trang HTML kết quả học tập
router.get("/KetQuaHocTap", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/KetQuaHocTap", "completedCourses.html"));
});

module.exports = router;