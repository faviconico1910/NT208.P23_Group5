require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const cors = require("cors");

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

const app = express();
const PORT = process.env.PORT;
const CLIENT_PORT = process.env.CLIENT_PORT || 5500;

// Cấu hình middleware
<<<<<<< HEAD
app.use(cors({
    allowedHeaders: ["Authorization", "Content-Type"],
=======
app.use(cors({ 
    allowedHeaders: ["Authorization", "Content-Type"], // Cho phép header Authorization
>>>>>>> 44c7642355524f482941a8a30dcf7103d894923c
    exposedHeaders: ["Authorization"]
}));
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

// Chạy server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API chạy tại http://127.0.0.1:${PORT}`);
    console.log(`🚀 Frontend chạy tại http://127.0.0.1:${CLIENT_PORT}`);
});
