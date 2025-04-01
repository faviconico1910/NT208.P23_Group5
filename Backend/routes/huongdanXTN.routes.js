const express = require("express");
const router = express.Router();
const {getHuongDanXTN} = require("../API-Controllers/huongdanXTN.controller");

router.get("/", getHuongDanXTN);
module.exports = router;