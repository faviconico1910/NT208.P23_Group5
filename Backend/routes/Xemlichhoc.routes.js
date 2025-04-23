const express = require("express");
const router = express.Router();
const {Xem_lich_hoc_page, Xem_lich_hoc, Lay_danh_sach_hoc_ki} = require('../API-Controllers/xemlichhoc.controller');
router.get("/", Xem_lich_hoc_page); 
router.get("/api",Xem_lich_hoc);
router.get("/hocki", Lay_danh_sach_hoc_ki);
module.exports = router;