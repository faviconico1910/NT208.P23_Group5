const express = require("express");
const router = express.Router();
const {getHuongDanXTN, Diem_ren_luyen, Chung_Chi, Sinh_vien, Tong_Tin_Chi} = require("../API-Controllers/huongdanXTN.controller");

router.get("/", getHuongDanXTN);
router.get("/drl",Diem_ren_luyen);
router.get("/chungchi", Chung_Chi);
router.get("/sv", Sinh_vien);
router.get("/tinchi", Tong_Tin_Chi);
module.exports = router;