const express = require("express");
const path = require('path');
const { sendMessage } = require("../API-Controllers/chatbot.controller"); // Controller cho chatbot
const router = express.Router();

// API route cho chatbot
router.post("/api", sendMessage);

// Frontend route (trả về file chatbot.html)
router.get("/chatbot", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend", "chatbot.html"));
});

module.exports = router;