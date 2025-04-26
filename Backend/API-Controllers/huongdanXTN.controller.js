const db = require('../config/db.js'); 
const path = require("path");
const jwt = require("jsonwebtoken");
const getHuongDanXTN = (req,res)=>{
    res.sendFile(path.join(__dirname,"../../Frontend/HuongDanXetTotNghiep/huongdanXTN.html"))
}

const Diem_ren_luyen = async (req,res)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }  
    
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;
        const sql = 
        `SELECT ROUND(AVG(Diem_Ren_Luyen)) AS Trung_Binh_Ren_Luyen
        FROM DIEMRL
        WHERE Ma_Sinh_Vien = ?`
        const [result] = await db.query(sql, [userId]);
        console.log("✅ Truy vấn thành công:", result);
        return res.json(result);

    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);
        return res.status(500).json({ message: "Lỗi xử lý phía server!" });
    }
}
const Chung_Chi = async (req,res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }  
    
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;
        const sql = 
        `SELECT Chung_Chi_Anh_Van, Chung_Chi_Quan_Su
        FROM SINHVIEN
        WHERE Ma_Sinh_Vien = ?`
        const [result] = await db.query(sql, [userId]);
        console.log("✅ Truy vấn thành công:", result);
        return res.json(result);

    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);
        return res.status(500).json({ message: "Lỗi xử lý phía server!" });
    }
}
const Sinh_vien = async (req,res)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }  
    
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;
        const sql = 
        `SELECT Ma_Nganh, Nam_Nhap_Hoc
        FROM SINHVIEN
        WHERE Ma_Sinh_Vien = ?`
        const [result] = await db.query(sql, [userId]);
        console.log("✅ Truy vấn thành công:", result);
        return res.json(result);

    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);
        return res.status(500).json({ message: "Lỗi xử lý phía server!" });
    }
}

const Tong_Tin_Chi = async (req,res)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }  
    
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;
        const sql = 
        `SELECT dk.Ma_Sinh_Vien, mh.Khoa, SUM(mh.Tin_chi_LT + mh.Tin_chi_TH) AS Tong_Tin_Chi_Tich_Luy
        FROM DANGKY dk 
        JOIN  SINHVIEN sv ON dk.Ma_Sinh_Vien = sv.Ma_Sinh_Vien 
        JOIN MONHOC mh ON mh.Ma_Mon_Hoc = dk.Ma_Mon_Hoc AND mh.Ma_Nganh = sv.Ma_Nganh AND mh.Khoa = CONCAT('K', sv.Nam_Nhap_Hoc - 2005)
        WHERE dk.Ma_Sinh_Vien = ?
        GROUP BY dk.Ma_Sinh_Vien, mh.Khoa`
        const [result] = await db.query(sql, [userId]);
        console.log("✅ Truy vấn thành công:", result);
        return res.json(result);

    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);
        return res.status(500).json({ message: "Lỗi xử lý phía server!" });
    }
}
module.exports = {getHuongDanXTN, Diem_ren_luyen, Chung_Chi, Sinh_vien, Tong_Tin_Chi};