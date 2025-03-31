const express = require("express");
const router = express.Router();
const {Xem_lich_hoc_page, Xem_lich_hoc} = require('../API-Controllers/xemlichhoc.controller');
router.get("/", Xem_lich_hoc_page); 
router.get("/api",Xem_lich_hoc);
module.exports = router;