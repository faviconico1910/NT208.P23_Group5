const db = require("../config/db.js");
const jwt = require('jsonwebtoken'); // Thêm dòng này

const getSystemStats = async (req, res) => {
    try {
        // 1. Xác thực token (giống như trong completedCourses)
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(403).json({ 
                success: false,
                message: "Token không hợp lệ!" 
            });
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Kiểm tra role là admin
        if (decoded.Vai_Tro !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập!"
            });
        }

        // 3. Lấy thống kê từ database
        const [students] = await db.query(
            "SELECT COUNT(*) as count FROM USER WHERE Tai_Khoan LIKE '%52%'"
        );
        console.log('Số sinh viên:', students[0].count); // Thêm dòng này

        const [teachers] = await db.query(
            "SELECT COUNT(*) as count FROM USER WHERE Tai_Khoan LIKE '%GV%'"
        );
        
        const [courses] = await db.query(
            "SELECT COUNT(*) as count FROM MONHOC"
        );
        
        const [classes] = await db.query(
            "SELECT COUNT(*) as count FROM LOP"
        );

        // 4. Trả về kết quả
        res.json({
            success: true,
            message: "Lấy thống kê hệ thống thành công",
            data: {
                totalStudents: students[0].count,
                totalTeachers: teachers[0].count,
                totalCourses: courses[0].count,
                totalClasses: classes[0].count
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi server",
            error: error.message 
        });
    }
};

module.exports = { getSystemStats };