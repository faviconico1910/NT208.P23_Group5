// Xemlichhoc.routes.js
const express = require("express");
const router = express.Router();
const { 
  Xem_lich_hoc_page, 
  Xem_lich_hoc,
  Lay_danh_sach_hoc_ki,
  Xem_lich_hoc_current // Thêm controller mới
} = require('../API-Controllers/xemlichhoc.controller');
const { authenticateToken } = require('../API-Controllers/completedCourses.controller');

router.get("/", Xem_lich_hoc_page); 
router.get("/api", Xem_lich_hoc);
router.get("/hocki", Lay_danh_sach_hoc_ki);
// Thêm route mới
router.get("/api/current/:mssv", authenticateToken, Xem_lich_hoc_current);

module.exports = router;