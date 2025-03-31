const express = require('express');
const router = express.Router();
const { getGPAList, getGPAPage } = require('../API-Controllers/thongke.controller');

router.get('/', getGPAPage);
router.get("/api", getGPAList); // Trả về JSON dữ liệu
module.exports = router;
