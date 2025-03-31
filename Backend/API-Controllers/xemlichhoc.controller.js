const path = require('path');
const jwt = require("jsonwebtoken");
const db = require('../config/db.js');
const Xem_lich_hoc_page = (req,res)=>{
    res.sendFile(path.join(__dirname,'../../Frontend/Xemlichhoc/xemlichhoc.html'));
}
const Xem_lich_hoc = async(req,res)=>{
    try {
        const authHeader = req.headers.authorization; //lấy token từ header
        console.log("📌 Token nhận được từ client:", authHeader);
                    
        if (!authHeader || !authHeader.startsWith("Bearer ")) { // kiểm tra token có hợp lệ không
            return res.status(403).json({ message: "Không có token hoặc token không hợp lệ!" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.Tai_Khoan;  // MSSV lấy từ token
        
        console.log("📩 Nhận request xemlichhoc_ctrl với id từ token:", userId);
        const sql = `
        SELECT LH.Ma_Lop_Hoc, LH.Thu, LH.Tiet_Bat_Dau, LH.Tiet_Ket_Thuc, MH.Ten_Mon_Hoc, MH.Hoc_Ki
        FROM DANGKY DK
        JOIN LICHHOC LH ON DK.Ma_Lop_Hoc = LH.Ma_Lop_Hoc
        JOIN MONHOC MH ON DK.Ma_Mon_Hoc = MH.Ma_Mon_Hoc
        WHERE MH.Hoc_Ki = (
            SELECT MAX(MH2.Hoc_Ki) 
            FROM DANGKY DK2 
                JOIN MONHOC MH2 ON DK2.Ma_Mon_Hoc = MH2.Ma_Mon_Hoc 
            WHERE DK2.Ma_Sinh_Vien = DK.Ma_Sinh_Vien
        )
        AND DK.Ma_Sinh_Vien = ?
        AND LH.Tiet_Bat_Dau IS NOT NULL
        AND LH.Tiet_Ket_Thuc IS NOT NULL
        ORDER BY LH.Thu ASC, LH.Tiet_Bat_Dau ASC;`;
        db.query(sql, [userId],(err,result)=>{
                if(err){
                    console.error("❌ Lỗi truy vấn SQL:", err);
                }
                res.json(result);
            }
        );
    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);  
    }
};
module.exports = {Xem_lich_hoc_page, Xem_lich_hoc};