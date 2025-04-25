const express = require("express");
const router = express.Router();
const { getDeXuatPage, getMonHocTongHop } = require("../API-Controllers/dexuatmonhoc.controller");

// Route lấy danh sách môn học đề xuất
router.get("/", getDeXuatPage);   // Trả về giao diện HTML
router.get("/api", getMonHocTongHop); // Trả về JSON dữ liệu

module.exports = router;
