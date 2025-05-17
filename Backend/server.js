require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require('express-session');
const passport = require('./API-Controllers/auth.controller.js').passport;

//  routes
const authRoutes = require("./routes/auth.routes.js");
const studentRoutes = require('./routes/student.routes.js');
const huongdandkhpRoutes = require("./routes/Huongdandkhp.routes.js");
const xemlichhocRoutes = require("./routes/Xemlichhoc.routes.js");
const completedCoursesRoutes = require("./routes/completedCourses.routes.js");
const DeXuatMonHocRoutes = require("./routes/dexuatmonhoc.routes.js");
const thongKeRoutes = require('./routes/thongke.routes.js');
const teacherRoutes = require('./routes/teacher.routes.js');
const huongdanXTNRoutes = require("./routes/huongdanXTN.routes.js");
const chatbotRoutes = require("./routes/chatbot.routes.js");
const gioithieuRoutes = require("./routes/gioithieu.routes.js");   
const studentLists = require("./routes/DSSV.routes.js");   
const adminRoutes = require('./routes/admin.routes.js');

const app = express();
const PORT = process.env.PORT;
const CLIENT_PORT = process.env.CLIENT_PORT || 5500;

// Cấu hình middleware
app.use(cors({ 
    allowedHeaders: ["Authorization", "Content-Type"], // Cho phép header Authorization
    exposedHeaders: ["Authorization"]
}));
// cấu hình passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// remain
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));
app.use("/login", authRoutes);  
// đường dẫn cho profile của mỗi sinh viên /student/{id}, vd /student/24520001
app.use("/student", studentRoutes); 
app.use("/huongdandkhp", huongdandkhpRoutes);
app.use("/xemlichhoc", xemlichhocRoutes);
app.use("/completedCourses", completedCoursesRoutes);
app.use("/dexuatmonhoc", DeXuatMonHocRoutes);
app.use('/thongkesv', thongKeRoutes);
app.use('/teacher', teacherRoutes);
app.use("/huongdanXTN", huongdanXTNRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/dssv", studentLists);
app.use("/", gioithieuRoutes); // giới thiệu   routes
app.use("/admin", require("./routes/admin.routes.js"));

// Chạy server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API chạy tại http://127.0.0.1:${PORT}`);
    console.log(`🚀 Frontend chạy tại http://127.0.0.1:${CLIENT_PORT}`);
});
