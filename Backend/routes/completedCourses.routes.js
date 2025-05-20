const express = require("express");
const router = express.Router();
const path = require("path");
const { 
  getCompletedCourses,
  getCompletedCoursesByMSSV,
  getCurrentStudentCourses,
  authenticateToken,
  uploadTranscript
} = require("../API-Controllers/completedCourses.controller");

// API lấy kết quả theo token (sinh viên tự xem)
router.get("/api", authenticateToken, getCompletedCourses);


// API lấy kết quả theo MSSV (yêu cầu token hợp lệ)
//router.get("/api/:mssv", authenticateToken, getCompletedCoursesByMSSV);

// API lấy kết quả theo MSSV từ header (cho frontend)
router.get('/api/current/:mssv', authenticateToken, getCurrentStudentCourses);
// Trang HTML kết quả học tập

// API upload bảng điểm
router.post('/api/upload', authenticateToken, uploadTranscript);

router.get("/KetQuaHocTap", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/KetQuaHocTap", "completedCourses.html"));
});

module.exports = router;