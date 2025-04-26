const express = require("express");
const router = express.Router();
const path = require("path");
const { getIntroData } = require("../API-Controllers/gioithieu.controller");

router.route("/")
    .get((req, res) => {
        try {
            const filePath = path.join(__dirname, "../../Frontend/gioithieu.html");
            res.sendFile(filePath);
        } catch (error) {
            console.error("[ERROR] Failed to send HTML:", error);
            res.status(500).send("Lỗi server");
        }
    })
    .post(getIntroData);

module.exports = router;