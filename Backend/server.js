require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_PORT = process.env.CLIENT_PORT || 5500;

// Cấu hình middleware
app.use(express.json());
app.use(cors()); // Cho phép gọi API từ client
app.use(express.static(path.join(__dirname, "../Frontend"))); // Phục vụ file frontend
app.use("/", authRoutes);

// Chạy server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API chạy tại http://127.0.0.1:${PORT}`);
    console.log(`🚀 Frontend chạy tại http://127.0.0.1:${CLIENT_PORT}`);
});
