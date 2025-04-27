const express = require('express');
const {teacher_profile, updateProfile} = require("../API-Controllers/teacher_profile.controller.js");
const router = express.Router();
const path = require('path');
// api
router.get('/api', teacher_profile);
router.put("/api", updateProfile);
router.get("/:mgv", (req, res) => {
    const { mgv } = req.params;
    res.sendFile(path.join(__dirname, "../../Frontend/Teacher", "Teacher_profile.html"));
});



module.exports = router;