const express = require('express');
const {teacher_profile} = require("../API-Controllers/teacher_profile.controller.js");
const router = express.Router();

router.get('/api', teacher_profile);

module.exports = router;