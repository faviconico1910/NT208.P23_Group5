const db = require('../config/db.js');
const Xem_lich_hoc = async(req,res)=>{
    try {
        const Ma_Sinh_Vien = req.user?.Ma_Sinh_Vien;
        if(!Ma_Sinh_Vien) {
            return res.static(401).json({message: "Không tìm thấy thông tin sinh viên trong token!" });
        }
        db.query("SELECT LH.Ma_Lop_Hoc, LH.Thu, LH.Tiet_Bat_Dau, LH.Tiet_Ket_Thuc FROM SINHVIEN SV JOIN DANGKY DK ON SV.Ma_Sinh_Vien = DK.Ma_Sinh_Vien JOIN LICHHOC LH ON LH.Ma_Lop_Hoc = DK.Ma_Lop_Hoc WHERE SV.Ma_Sinh_Vien =?",
            [Ma_Sinh_Vien],(err,result)=>{
                if(err){
                    console.error("❌ Lỗi truy vấn SQL:", err);
                }
                res.json(result);
            }
        );
    } catch (error) {
        console.error("❌ Lỗi xử lý API:", error);  
    }
}
module.exports = {Xem_lich_hoc};