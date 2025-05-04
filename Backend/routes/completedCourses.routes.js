const express = require("express");
const router = express.Router();
const { getCompletedCourses } = require("../API-Controllers/completedCourses.controller"); // Kiểm tra lại đường dẫn này
const path = require('path');
// api
router.get("/api", getCompletedCourses);

// html
router.get("/KetQuaHocTap", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/KetQuaHocTap", "completedCourses.html"));
});
module.exports = router;
