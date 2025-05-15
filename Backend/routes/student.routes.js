const express = require("express");
const path = require('path')
const { profile, updateProfile, studentProfileFromTeacher }= require("../API-Controllers/student_profile.controller.js");
const router = express.Router();

// api
router.get("/api", profile);
router.put("/api", updateProfile);
router.get("/api/fromTeacher/:mssv", studentProfileFromTeacher)
// frontend
router.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend", "profile.html"));
});


module.exports = router;