const express = require("express");
const path = require('path')
const { profile } = require("../API-Controllers/student_profile.controller.js");
const router = express.Router();


router.get("/test/:Tai_Khoan", profile);
router.get("/:mssv", (req, res) => {
    const { mssv } = req.params;
    res.sendFile(path.join(__dirname, "../../Frontend", "profile.html"));
});


module.exports = router;