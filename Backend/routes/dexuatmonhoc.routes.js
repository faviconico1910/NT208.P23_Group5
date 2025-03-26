const express = require("express");
const router = express.Router();
const { getDeXuatPage, getDeXuatMonHoc } = require("../API-Controllers/dexuatmonhoc.controller");

// Route lấy danh sách môn học đề xuất
router.get("/dexuatmonhoc", getDeXuatPage);   // Trả về giao diện HTML
router.get("/api/dexuatmonhoc", getDeXuatMonHoc); // Trả về JSON dữ liệu

module.exports = router;
