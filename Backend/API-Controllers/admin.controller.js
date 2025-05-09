const jwt = require('jsonwebtoken'); // Thêm dòng này ở đầu file
const db = require("../config/db.js");
const authenticateAdmin = async (req, res, next) => {
    try {
        // Cho phép nhận token từ cả header và query string (tạm thời để debug)
        const token = req.headers.authorization?.split(' ')[1] || req.query.token;
        
        if (!token) {
            console.log('❌ No token found');
            return res.status(403).json({ message: "Token không hợp lệ!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kiểm tra vai trò
        if (decoded.Vai_Tro !== "admin") {
            return res.status(403).json({ message: "Không có quyền truy cập!" });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
};

module.exports = authenticateAdmin;