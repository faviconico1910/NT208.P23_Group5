const express = require("express");
const path = require('path')
const { profile } = require("../API-Controllers/student_profile.controller.js");
const router = express.Router();

router.get("/profile/:Tai_Khoan", profile);
router.get("/:Tai_Khoan", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend", "profile.html"));
});


module.exports = router;