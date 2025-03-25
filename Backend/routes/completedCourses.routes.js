const express = require("express");
const router = express.Router();
const { getCompletedCourses } = require("../API-Controllers/completedCourses.controller"); // Kiểm tra lại đường dẫn này

router.get("/:id", getCompletedCourses);

module.exports = router;
