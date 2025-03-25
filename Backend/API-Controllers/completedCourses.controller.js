const db = require("../config/db.js"); //Import file db.js để sử dụng kết nối MySQL.

//Tạo một hàm bất đồng bộ (async) để xử lý yêu cầu lấy danh sách môn học đã hoàn thành.
const getCompletedCourses = async (req, res) => {
    const { id } = req.params; // Lấy mã sinh viên từ URL
    
    //Viết câu truy vấn SQL để lấy danh sách môn học đã hoàn thành của sinh viên.
    const sql = `
    SELECT mh.Ma_Mon_Hoc, mh.Ten_Mon_Hoc, kq.Diem_HP
    FROM KETQUA kq
    JOIN MONHOC mh ON kq.Ma_Mon_Hoc = mh.Ma_Mon_Hoc
    WHERE kq.Ma_Sinh_Vien = ? AND kq.Diem_HP >= 5`;

    //Gửi truy vấn SQL đến MySQL.
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn SQL:", err);
            return res.status(500).json({ message: "Lỗi server!", error: err });    //Trả về JSON báo lỗi cho client.
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Sinh viên chưa hoàn thành môn học nào!" });
        }
        res.json(result);   //Trả về danh sách môn học đã hoàn thành cho client.
    });
};

module.exports = { getCompletedCourses };
