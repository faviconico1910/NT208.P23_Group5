const express = require("express");
const router = express.Router();
const db = require("../config/db.js"); // Đường dẫn đến file cấu hình DB của bạn
const authenticateAdmin = require("../API-Controllers/admin.controller.js"); // Middleware kiểm tra admin

// Lấy danh sách tất cả các lớp học
router.get("/classes", authenticateAdmin, async (req, res) => {
    try {
        // Lấy thông tin lớp học và số lượng sinh viên hiện tại trong mỗi lớp
        // So_Luong_Hien_Tai sẽ được tính từ bảng SINHVIEN dựa trên Ma_Lop
        const [classes] = await db.query(`
           SELECT
                L.Ma_Lop,
                L.Ten_Lop,
                L.So_Luong,
                L.Co_Van_Hoc_Tap,
                COUNT(SV.Ma_Sinh_Vien) AS So_Luong_Hien_Tai
            FROM LOP L
            LEFT JOIN SINHVIEN SV ON L.Ma_Lop = SV.Ma_Lop
            GROUP BY L.Ma_Lop
        `);
        res.json({
            success: true,
            data: classes
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp học:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// Thêm lớp học mới
router.post("/classes", authenticateAdmin, async (req, res) => {
    try {
        const { Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap } = req.body;

        // Kiểm tra xem mã lớp đã tồn tại chưa
        const [existingClass] = await db.query("SELECT Ma_Lop FROM LOP WHERE Ma_Lop = ?", [Ma_Lop]);
        if (existingClass.length > 0) {
            return res.status(400).json({ success: false, message: "Mã lớp đã tồn tại." });
        }

        await db.query(
            "INSERT INTO LOP (Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap) VALUES (?, ?, ?, ?)",
            [Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap]
        );
        res.json({
            success: true,
            message: "Thêm lớp học thành công"
        });
    } catch (error) {
        console.error("Lỗi khi thêm lớp học:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// Sửa thông tin lớp học
router.put("/classes/:Ma_Lop", authenticateAdmin, async (req, res) => {
    try {
        const { Ma_Lop } = req.params;
        const { Ten_Lop, So_Luong, Co_Van_Hoc_Tap } = req.body;

        // Kiểm tra xem lớp học có tồn tại không
        const [existingClass] = await db.query("SELECT Ma_Lop FROM LOP WHERE Ma_Lop = ?", [Ma_Lop]);
        if (existingClass.length === 0) {
            return res.status(404).json({ success: false, message: "Lớp học không tồn tại." });
        }

        // Cập nhật thông tin lớp học
        await db.query(
            "UPDATE LOP SET Ten_Lop = ?, So_Luong = ?, Co_Van_Hoc_Tap = ? WHERE Ma_Lop = ?",
            [Ten_Lop, So_Luong, Co_Van_Hoc_Tap, Ma_Lop]
        );
        res.json({
            success: true,
            message: "Cập nhật lớp học thành công"
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật lớp học:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// Xóa lớp học
router.delete("/classes/:Ma_Lop", authenticateAdmin, async (req, res) => {
    try {
        const { Ma_Lop } = req.params;

        // 1. Kiểm tra xem lớp học có tồn tại không
        const [existingClass] = await db.query("SELECT Ma_Lop FROM LOP WHERE Ma_Lop = ?", [Ma_Lop]);
        if (existingClass.length === 0) {
            return res.status(404).json({ success: false, message: "Lớp học không tồn tại." });
        }

        // 2. Cập nhật Ma_Lop của các sinh viên thuộc lớp này thành NULL
        // Điều này giả định Ma_Lop trong bảng SINHVIEN là nullable.
        // Nếu không, bạn cần ALTER TABLE SINHVIEN MODIFY COLUMN Ma_Lop VARCHAR(255) NULL;
        await db.query("UPDATE SINHVIEN SET Ma_Lop = NULL WHERE Ma_Lop = ?", [Ma_Lop]);

        // 3. Xóa lớp học
        await db.query("DELETE FROM LOP WHERE Ma_Lop = ?", [Ma_Lop]);

        res.json({
            success: true,
            message: "Xóa lớp học thành công"
        });
    } catch (error) {
        console.error("Lỗi khi xóa lớp học:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// Thêm sinh viên vào lớp
router.post("/classes/:Ma_Lop/add-student", authenticateAdmin, async (req, res) => {
    try {
        const { Ma_Lop } = req.params;
        const { Tai_Khoan } = req.body; // Tai_Khoan ở đây được xem là Ma_Sinh_Vien

        // 1. Kiểm tra xem lớp học có tồn tại không
        const [targetClass] = await db.query("SELECT So_Luong FROM LOP WHERE Ma_Lop = ?", [Ma_Lop]);
        if (targetClass.length === 0) {
            return res.status(404).json({ success: false, message: "Lớp học không tồn tại." });
        }
        const maxQuantity = targetClass[0].So_Luong;

        // 2. Kiểm tra xem sinh viên có tồn tại và có vai trò 'SinhVien' không (từ bảng USER)
        const [user] = await db.query("SELECT Vai_Tro FROM USER WHERE Tai_Khoan = ?", [Tai_Khoan]);
        if (user.length === 0 || user[0].Vai_Tro !== 'SinhVien') {
            return res.status(404).json({ success: false, message: "Tài khoản sinh viên không tồn tại hoặc không phải là sinh viên." });
        }

        // 3. Kiểm tra số lượng sinh viên hiện tại trong lớp (từ bảng SINHVIEN)
        const [currentStudents] = await db.query(
            "SELECT COUNT(Ma_Sinh_Vien) AS So_Luong_Hien_Tai FROM SINHVIEN WHERE Ma_Lop = ?",
            [Ma_Lop]
        );
        const currentQuantity = currentStudents[0].So_Luong_Hien_Tai;

        if (currentQuantity >= maxQuantity) {
            return res.status(400).json({ success: false, message: "Lớp học đã đủ số lượng sinh viên." });
        }

        // 4. Kiểm tra xem sinh viên đã có trong lớp này chưa (từ bảng SINHVIEN)
        const [existingEntry] = await db.query(
            "SELECT Ma_Sinh_Vien FROM SINHVIEN WHERE Ma_Lop = ? AND Ma_Sinh_Vien = ?",
            [Ma_Lop, Tai_Khoan] // Tai_Khoan ở đây chính là Ma_Sinh_Vien của sinh viên
        );
        if (existingEntry.length > 0) {
            return res.status(400).json({ success: false, message: "Sinh viên này đã có trong lớp học." });
        }
        
        // 5. Kiểm tra xem sinh viên có đang ở lớp khác không (không bắt buộc, nhưng tốt để tránh trùng lặp)
        const [studentCurrentClass] = await db.query(
            "SELECT Ma_Lop FROM SINHVIEN WHERE Ma_Sinh_Vien = ?",
            [Tai_Khoan]
        );
        if (studentCurrentClass.length > 0 && studentCurrentClass[0].Ma_Lop !== null) {
            return res.status(400).json({ success: false, message: `Sinh viên này đã thuộc lớp ${studentCurrentClass[0].Ma_Lop}.` });
        }


        // 6. Cập nhật Ma_Lop của sinh viên vào lớp
        await db.query(
            "UPDATE SINHVIEN SET Ma_Lop = ? WHERE Ma_Sinh_Vien = ?",
            [Ma_Lop, Tai_Khoan]
        );

        res.json({
            success: true,
            message: "Thêm sinh viên vào lớp thành công"
        });
    } catch (error) {
        console.error("Lỗi khi thêm sinh viên vào lớp:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// Xóa sinh viên khỏi lớp (thay đổi để cập nhật Ma_Lop của sinh viên thành NULL)
router.delete("/classes/:Ma_Lop/remove-student/:Tai_Khoan", authenticateAdmin, async (req, res) => {
    try {
        const { Ma_Lop, Tai_Khoan } = req.params; // Tai_Khoan ở đây là Ma_Sinh_Vien

        // 1. Kiểm tra xem lớp học có tồn tại không
        const [existingClass] = await db.query("SELECT Ma_Lop FROM LOP WHERE Ma_Lop = ?", [Ma_Lop]);
        if (existingClass.length === 0) {
            return res.status(404).json({ success: false, message: "Lớp học không tồn tại." });
        }

        // 2. Kiểm tra xem sinh viên có tồn tại trong lớp này không
        const [existingStudentInClass] = await db.query(
            "SELECT Ma_Sinh_Vien FROM SINHVIEN WHERE Ma_Lop = ? AND Ma_Sinh_Vien = ?",
            [Ma_Lop, Tai_Khoan]
        );
        if (existingStudentInClass.length === 0) {
            return res.status(404).json({ success: false, message: "Sinh viên không tồn tại trong lớp học này." });
        }

        // 3. Cập nhật Ma_Lop của sinh viên thành NULL để xóa khỏi lớp
        await db.query(
            "UPDATE SINHVIEN SET Ma_Lop = NULL WHERE Ma_Lop = ? AND Ma_Sinh_Vien = ?",
            [Ma_Lop, Tai_Khoan]
        );

        res.json({
            success: true,
            message: "Xóa sinh viên khỏi lớp thành công"
        });
    } catch (error) {
        console.error("Lỗi khi xóa sinh viên khỏi lớp:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

module.exports = router;