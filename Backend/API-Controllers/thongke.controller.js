const db = require('../config/db.js'); 
const path = require("path");
const jwt = require("jsonwebtoken");

const getGPAPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/ThongKe/ThongKe.html"));
};
const getGPAList = async (req, res) => {
    try {
        // const authHeader = req.headers.authorization; //lấy token từ header
        // console.log("📌 Token nhận được từ client:", authHeader);
        
        // if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
        //     return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        // }
        // const token = authHeader.split(" ")[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decoded.Tai_Khoan;  // MSSV lấy từ token

        // console.log("📩 Nhận request student_profile với id từ token:", userId);
        const userId = 'GV015'
        const query = `
            SELECT 
                lop.Ma_Lop, 
                kq.Ma_Sinh_Vien,
                ROUND(SUM(kq.Diem_HP * (mh.Tin_chi_LT + mh.Tin_chi_TH)) / SUM(mh.Tin_chi_LT + mh.Tin_chi_TH), 2) AS GPA,
                SUM(mh.Tin_chi_LT + mh.Tin_chi_TH) AS Tong_Tin_Chi
            FROM KETQUA kq
            JOIN MONHOC mh ON kq.Ma_Mon_Hoc = mh.Ma_Mon_Hoc
            JOIN SINHVIEN sv ON kq.Ma_Sinh_Vien = sv.Ma_Sinh_Vien
            JOIN LOP lop ON sv.Ma_Lop = lop.Ma_Lop
            WHERE lop.Ma_Lop in(
				select Ma_Lop
                from Lop
                where Co_Van_Hoc_Tap = ?
            )
            GROUP BY kq.Ma_Sinh_Vien, lop.Ten_Lop
            ORDER BY GPA DESC;
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Lỗi truy vấn:", err);
                return res.status(500).json({ error: "Lỗi khi lấy dữ liệu GPA." });
            }

            if (results.length === 0) {
                return res.json({ maLop: "Không xác định", sinhVien: [] });
            }

            const Ma_Lop = results[0].Ma_Lop;

            res.json({ 
                Ma_Lop, 
                sinhVien: results.map(({ Ma_Lop, ...rest }) => rest) 
            });
        });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ error: "Lỗi máy chủ!" });
    }
};


module.exports = { getGPAList, getGPAPage };
