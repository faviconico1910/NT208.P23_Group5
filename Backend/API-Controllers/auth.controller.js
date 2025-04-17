const db = require("../config/db.js");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { Tai_Khoan, Mat_Khau } = req.body;

    if (!Tai_Khoan || !Mat_Khau) {
        return res.status(401).json({ message: "Không được để trống ô tài khoản và mật khẩu!" });
    }

    console.log("📩 Nhận request đăng nhập:", Tai_Khoan, Mat_Khau);

    try {
        const [result] = await db.query("SELECT * FROM USER WHERE Tai_Khoan = ?", [Tai_Khoan]);

        if (result.length === 0) {
            console.log("❌ Sai tài khoản hoặc mật khẩu!");
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        const user = result[0];
        console.log("✅ Tìm thấy user:", user);

        if (Mat_Khau !== user.Mat_Khau) {
            console.log("❌ Sai mật khẩu!");
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        const token = jwt.sign(
            { id: user.id, Tai_Khoan: user.Tai_Khoan, Vai_Tro: user.Vai_Tro },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("✅ Đăng nhập thành công!");
        res.json({
            message: "Đăng nhập thành công!",
            token,
            Vai_Tro: user.Vai_Tro,
            Tai_Khoan: user.Tai_Khoan
        });
    } catch (err) {
        console.error("❌ Lỗi truy vấn SQL:", err);
        return res.status(500).json({ message: "Lỗi server!", error: err });
    }
};

module.exports = { login };
