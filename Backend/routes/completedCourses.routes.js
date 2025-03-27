const express = require("express");
const router = express.Router();
const { getCompletedCourses } = require("../API-Controllers/completedCourses.controller"); // Kiểm tra lại đường dẫn này

router.get("/", getCompletedCourses);
module.exports = router;
