const express = require("express");
const { profile } = require("../API-Controllers/student_profile.controller.js");
const router = express.Router();

router.get("/student/:id", profile);

module.exports = router;