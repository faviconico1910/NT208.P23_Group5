const db = require('../config/db.js');
const profile = async(req, res) => {
    var {id} = req.params;

    const sql = "SELECT * FROM SINHVIEN WHERE Ma_Sinh_Vien = ? ";
    db.query(sql, [id], (err, result) => {
        if (err)
        {
            console.error("Lỗi truy vấn SQL:", err);
            return res.status(500).json({ message: "Lỗi server!", error: err });
        }
        if (result.length == 0)
            return res.status(404).json({ message: "Không tìm thấy sinh viên!" });
        res.json(result[0]);
    })
}
module.exports = {profile};