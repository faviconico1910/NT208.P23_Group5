const express = require('express');
const {teacher_profile} = require("../API-Controllers/teacher_profile.controller.js");
const router = express.Router();
const path = require('path');
router.get('/api', teacher_profile);
router.get("/:mgv", (req, res) => {
    const { mgv } = req.params;
    res.sendFile(path.join(__dirname, "../../Frontend/Teacher", "Teacher_profile.html"));
});



module.exports = router;