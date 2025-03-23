const express = require("express");
const { huongdan } = require('../API-Controllers/huongdandkhp_ctrl');

const router = express.Router();
router.get('/', huongdan);

module.exports = router;