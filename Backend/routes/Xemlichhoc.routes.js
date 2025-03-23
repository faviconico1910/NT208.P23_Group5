const express = require("express");
const path = require("path");
const router = express.Router();
const {xemlichhocCTRL} = require('../API-Controllers/xemlichhoc.controller');
router.get('/',xemlichhocCTRL);
module.exports = router;