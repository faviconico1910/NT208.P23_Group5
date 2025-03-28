const express = require("express");
const router = express.Router();
const {Xem_lich_hoc} = require('../API-Controllers/xemlichhoc.controller');
router.get("/",Xem_lich_hoc);
module.exports = router;