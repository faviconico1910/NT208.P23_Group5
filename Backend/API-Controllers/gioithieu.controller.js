const path = require('path');
const fs = require('fs');

exports.getGioiThieuPage = async (req, res) => {
    try {
        // Đọc file HTML và gửi về client
        const filePath = path.join(__dirname, '../../Frontend/GioiThieu/gioithieu.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error("[CONTROLLER ERROR]", err);
                return res.status(500).send('Lỗi tải trang giới thiệu');
            }
            res.send(data);
        });
    } catch (error) {
        console.error("[CONTROLLER ERROR]", error);
        res.status(500).send('Lỗi tải trang giới thiệu');
    }
};