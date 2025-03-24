const express = require("express");
const { profile } = require("../API-Controllers/student_profile.controller.js");
const router = express.Router();
// sửa lại thành 
router.get("/student_profile", profile);

module.exports = router;