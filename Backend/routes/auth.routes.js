const express = require("express");
const { login } = require("../API-controllers/auth.controller");

const router = express.Router();
router.post("/login", login);
module.exports = router;
