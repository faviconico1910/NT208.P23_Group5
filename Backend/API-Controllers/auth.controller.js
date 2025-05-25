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

        let redirect = "/";
        if (user.Vai_Tro === "SinhVien") redirect = "/completedCourses/KetQuaHocTap";
        else if (user.Vai_Tro === "GiangVien") redirect = `/teacher/${user.Tai_Khoan}`;
        else if (user.Vai_Tro === "admin" || user.Vai_Tro === "Admin") redirect = "/admin";

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
            Tai_Khoan: user.Tai_Khoan,
            redirect
        });
    } catch (err) {
        console.error("❌ Lỗi truy vấn SQL:", err);
        return res.status(500).json({ message: "Lỗi server!", error: err });
    }
};

// đăng nhập qua gmail uit
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: "/login/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      if (!email.endsWith('@gm.uit.edu.vn')) {
        return done(null, false, { message: 'Chỉ sinh viên UIT mới được phép đăng nhập.' });
      }
      // tìm trong database
      const [rows] = await db.query("SELECT * FROM SINHVIEN WHERE Email_Truong = ?", [email]);

      if (rows.length === 0) {
        return done(null, false, { message: 'Không tìm thấy sinh viên trong hệ thống.' });
      }

      const user = rows[0];
      console.log("User data before token creation:", {
        Tai_Khoan: user.Ma_Sinh_Vien,
        Vai_Tro: 'SinhVien',
        id: user.Ma_Sinh_Vien
      });

      const token = jwt.sign(
        { 
          Tai_Khoan: user.Ma_Sinh_Vien,
          Vai_Tro: 'SinhVien',
          id: user.Ma_Sinh_Vien 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("Generated token payload:", jwt.verify(token, process.env.JWT_SECRET));
      return done(null, { 
        ...user, 
        token,
        Tai_Khoan: user.Ma_Sinh_Vien,
        Vai_Tro: 'SinhVien'
      });

    } catch (err) {
      console.error("Lỗi GoogleStrategy:", err);
      return done(err, false);
    }
  }
));
const googleLoginCallback = (req, res) => {
  console.log("Callback Google đã chạy, req.user:", req.user);
  const user = req.user;
  console.log("Thông tin user từ passport:", user);

  if (!user || !user.token) {
      console.error("Token không tồn tại trong user object:", user);
      return res.redirect('/login?error=oauth');
  }

  let redirect = "/";
  if (user.Vai_Tro === "SinhVien") redirect = "/student/profile";
  else if (user.Vai_Tro === "GiangVien") redirect = `/teacher/${user.Tai_Khoan}`;
  else if (user.Vai_Tro === "admin" || user.Vai_Tro === "Admin") redirect = "/admin";

  // Trả về HTML có JS tự động lưu token và chuyển hướng
  res.send(`
    <html>
      <body>
        <script>
          localStorage.setItem('token', '${user.token}');
          localStorage.setItem('Vai_Tro', '${user.Vai_Tro}');
          localStorage.setItem('Tai_Khoan', '${user.Tai_Khoan}');
          window.location.href = '${redirect}';
        </script>
        <p>Đang chuyển hướng...</p>
      </body>
    </html>
  `);
};
module.exports = { login, googleLoginCallback, passport};
