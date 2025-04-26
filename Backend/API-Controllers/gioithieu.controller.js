const db = require("../config/db.js");
const jwt = require("jsonwebtoken");

const getIntroData = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token không tồn tại'
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        const studentId = decoded.Tai_Khoan;
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Token không chứa thông tin tài khoản sinh viên'
            });
        }

        const semester = req.body.semester || (new Date().getMonth() >= 8 || new Date().getMonth() < 2 ? 1 : 2);

        const [studentInfo] = await db.query(`
            SELECT sv.*, k.Ten_Khoa, n.Ten_Nganh, l.Ten_Lop 
            FROM SINHVIEN sv
            JOIN KHOA k ON sv.Ma_Khoa = k.Ma_Khoa
            JOIN NGANH n ON sv.Ma_Nganh = n.Ma_Nganh
            JOIN LOP l ON sv.Ma_Lop = l.Ma_Lop
            WHERE sv.Ma_Sinh_Vien = ?
        `, [studentId]);

        if (!studentInfo.length) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin sinh viên'
            });
        }

        const [academicInfo] = await db.query(`
            SELECT SUM(m.Tin_chi_LT + m.Tin_chi_TH) AS totalCredits,
                   AVG(k.Diem_HP) AS gpa
            FROM KETQUA k
            JOIN MONHOC m ON k.Ma_Mon_Hoc = m.Ma_Mon_Hoc
            WHERE k.Ma_Sinh_Vien = ? AND k.Diem_HP >= 4
        `, [studentId]);

        const currentYear = new Date().getFullYear();
        const [currentSubjects] = await db.query(`
            SELECT m.Ma_Mon_Hoc AS maMon, m.Ten_Mon_Hoc AS tenMon, 
                   (m.Tin_chi_LT + m.Tin_chi_TH) AS soTC, 
                   m.Loai_MH AS loaiMon, 
                   CONCAT('Thứ ', lh.Thu, ', tiết ', lh.Tiet_Bat_Dau, '-', lh.Tiet_Ket_Thuc) AS lichHoc
            FROM DANGKY dk
            JOIN MONHOC m ON dk.Ma_Mon_Hoc = m.Ma_Mon_Hoc
            JOIN LICHHOC lh ON dk.Ma_Lop_Hoc = lh.Ma_Lop_Hoc
            WHERE dk.Ma_Sinh_Vien = ? AND m.Hoc_Ki = ?
            ORDER BY lh.Thu, lh.Tiet_Bat_Dau
        `, [studentId, semester]);

        res.json({
            success: true,
            data: {
                studentInfo: studentInfo[0],
                academicInfo: {
                    totalCredits: academicInfo[0]?.totalCredits || 0,
                    gpa: academicInfo[0]?.gpa ? parseFloat(academicInfo[0].gpa.toFixed(2)) : 0
                },
                currentSubjects: {
                    academicYear: `${currentYear}-${currentYear + 1}`,
                    semester,
                    subjects: currentSubjects
                }
            }
        });

    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
};
module.exports = {getIntroData};