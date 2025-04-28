const express = require("express");
const path = require('path');
const {studentList} =  require("../API-Controllers/DSSV.controller.js");
const router = express.Router();

// api
router.get("/api", studentList);

// frontend
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/Teacher", "DSSV.html"));
});
module.exports = router;