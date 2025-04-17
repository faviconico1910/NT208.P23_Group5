require("dotenv").config();
const mysql = require("mysql2/promise");

// Kết nối MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const conn = await db.getConnection();
        console.log("✅ Kết nối MySQL (pool) thành công!");
        conn.release();
    } catch (err) {
        console.error("❌ Không thể kết nối đến MySQL:", err);
    }
})();

module.exports = db;

// --
// require("dotenv").config();
// const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// });

// db.connect((err) => {
//     if (err) {
//         console.error("❌ Lỗi kết nối MySQL:", err);
//     } else {
//         console.log("✅ Kết nối MySQL thành công!");
//     }
// });

// module.exports = db;