const express = require("express");
const path = require("path");
const { login } = require("../API-Controllers/auth.controller.js");

const router = express.Router();
router.post("/", login);
router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../Frontend", "login.html"))
})
module.exports = router;
