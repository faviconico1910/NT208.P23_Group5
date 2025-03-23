const express = require("express");
const path = require("path");
const { login } = require("../API-Controllers/auth.controller.js");

const router = express.Router();
router.post("/login", login);
router.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../../Frontend", "login.html"))
})
module.exports = router;
