const express = require("express");
const router = express.Router();
const gioithieuController = require("../API-Controllers/gioithieu.controller");

router.route("/")
    .get(gioithieuController.getGioiThieuPage);

module.exports = router;