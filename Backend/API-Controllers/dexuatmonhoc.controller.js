const db = require('../config/db.js');
const path = require("path");
const jwt = require("jsonwebtoken");

const getDeXuatPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/DeXuat/DeXuat.html"));
};
// Hàm lấy danh sách môn học đề xuất
const getDeXuatMonHoc = async (req, res) => {
    try {
        const authHeader = req.headers.authorization; //lấy token từ header
        console.log("📌 Token nhận được từ client:", authHeader);
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        const userId = decoded.Tai_Khoan;  // MSSV lấy từ token

        console.log("📩 MSSV từ token:", userId);

        if (!userId) {
            return res.status(400).json({ error: "Mã sinh viên không hợp lệ hoặc chưa đăng nhập" });
        }

        const query = `
            WITH MHDaHoc AS (
                -- Lấy danh sách các môn mà sinh viên đã học
                SELECT m.Ma_Mon_Hoc, m.Do_Kho
                FROM KETQUA k
                JOIN MONHOC m ON k.Ma_Mon_Hoc = m.Ma_Mon_Hoc
                WHERE k.Ma_Sinh_Vien = ?
            ),
            Do_Kho_Da_Hoc AS (
                -- Tìm độ khó cao nhất mà sinh viên đã học hết tất cả các môn ở mức đó
                SELECT MAX(mh.Do_Kho) AS Do_Kho
                FROM MONHOC mh
                WHERE NOT EXISTS (
                    SELECT 1 FROM MONHOC m2
                    WHERE m2.Do_Kho = mh.Do_Kho
                    AND m2.Ma_Mon_Hoc NOT IN (SELECT Ma_Mon_Hoc FROM MHDaHoc)
                )
            ),
            Do_Kho_TiepTheo AS (
                -- Lấy độ khó nhỏ nhất mà sinh viên chưa học hết tất cả các môn
                SELECT MIN(mh.Do_Kho) AS Do_Kho_De_Xuat
                FROM MONHOC mh
                WHERE mh.Do_Kho <= IFNULL((SELECT Do_Kho FROM Do_Kho_Da_Hoc), 0)
                AND mh.Ma_Mon_Hoc NOT IN (SELECT Ma_Mon_Hoc FROM MHDaHoc)
            ),
            MH_HocLai AS (
                -- Lấy danh sách môn học lại
                SELECT mh.*, 1 AS Priority
                FROM MONHOC mh
                JOIN KETQUA k ON mh.Ma_Mon_Hoc = k.Ma_Mon_Hoc
                WHERE k.Ma_Sinh_Vien = ?
                AND k.GHI_CHU = 'Học lại'
            ),
            MHDuocDeXuat AS (
                -- Lấy môn có độ khó nhỏ nhất chưa học
                SELECT mh.*, 2 AS Priority
                FROM MONHOC mh
                WHERE mh.Do_Kho = (SELECT Do_Kho_De_Xuat FROM Do_Kho_TiepTheo)
                AND mh.Ma_Mon_Hoc NOT IN (SELECT Ma_Mon_Hoc FROM MHDaHoc)
            ),
            MHBoSung AS (
                -- Nếu chưa đủ 5 môn, lấy thêm môn có độ khó cao hơn
                SELECT mh.*, 3 AS Priority
                FROM MONHOC mh
                WHERE mh.Do_Kho = (
                    SELECT MIN(Do_Kho) FROM MONHOC 
                    WHERE Do_Kho > IFNULL((SELECT Do_Kho_De_Xuat FROM Do_Kho_TiepTheo), 0)
                )
                AND mh.Ma_Mon_Hoc NOT IN (SELECT Ma_Mon_Hoc FROM MHDaHoc)
            )
            SELECT Ma_Mon_Hoc, Ten_Mon_Hoc, Ma_Khoa, Loai_MH, Hoc_ki, Tin_chi_LT, Tin_chi_TH, Ma_Mon_Hoc_Truoc, Do_Kho FROM (
                SELECT * FROM MH_HocLai
                UNION ALL
                SELECT * FROM MHDuocDeXuat
                UNION ALL
                SELECT * FROM MHBoSung
            ) AS Combined
            ORDER BY Priority, Do_Kho
            LIMIT 10;
        `;

        db.query(query, [userId, userId], (error, results) => {
            if (error) {
                console.error("Lỗi lấy dữ liệu:", error);
                return res.status(500).json({ error: "Lỗi server" });
            }
            res.json(results);
        });
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

module.exports = { getDeXuatPage, getDeXuatMonHoc };
