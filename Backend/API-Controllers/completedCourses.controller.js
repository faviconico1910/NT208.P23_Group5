const db = require("../config/db.js");
const jwt = require("jsonwebtoken");

// Hàm validate MSSV tập trung
const validateMSSV = (mssv) => {
  if (!mssv) return { isValid: false, message: "Thiếu thông tin MSSV" };
  if (typeof mssv !== 'string' && typeof mssv !== 'number') {
    return { isValid: false, message: "MSSV phải là chuỗi hoặc số" };
  }

  const mssvStr = mssv.toString();
  if (!/^\d{8,10}$/.test(mssvStr)) {
    return { 
      isValid: false, 
      message: "MSSV phải là số từ 8-10 chữ số",
      received: mssvStr
    };
  }

  return { isValid: true, mssv: mssvStr };
};

// Hàm xây dựng query SQL
const buildQuery = (studentId, Nam_Nhap_Hoc, Ma_Nganh, filters = {}) => {
  try {
    const { hocKy, namHoc } = filters;
    const Khoa = `K${Nam_Nhap_Hoc - 2005}`;
    
    let whereConditions = ["kq.Ma_Sinh_Vien = ?", "kq.Diem_HP IS NOT NULL"];
    let queryParams = [studentId];

    // Xử lý lọc theo học kỳ/năm học
    if (hocKy && namHoc) {
      const hocKyNum = parseInt(hocKy);
      const [startYear] = namHoc.split('-').map(Number);
      const expectedHocKy = (startYear - Nam_Nhap_Hoc) * 2 + hocKyNum;
      whereConditions.push("kq.Hoc_Ky = ?");
      queryParams.push(expectedHocKy);
    } else if (hocKy) {
      whereConditions.push("kq.Hoc_Ky = ?");
      queryParams.push(parseInt(hocKy));
    } else if (namHoc) {
      const [startYear] = namHoc.split('-').map(Number);
      const yearOffset = startYear - Nam_Nhap_Hoc;
      const startHocKy = yearOffset * 2 + 1;
      const endHocKy = yearOffset * 2 + 2;
      whereConditions.push(`kq.Hoc_Ky BETWEEN ? AND ?`);
      queryParams.push(startHocKy, endHocKy);
    }

    const sqlQuery = `
      SELECT 
        kq.Hoc_Ky,
        dk.Ma_Mon_Hoc,
        CASE 
          WHEN dk.LOAI = 'chinh' THEN mh.Ten_Mon_Hoc
          ELSE mhk.Ten_Mon_Hoc
        END AS Ten_Mon_Hoc,
        CASE 
          WHEN dk.LOAI = 'chinh' THEN (mh.Tin_chi_LT + IFNULL(mh.Tin_chi_TH, 0))
          ELSE (mhk.Tin_Chi_LT + IFNULL(mhk.Tin_Chi_TH, 0))
        END AS So_TC,
        kq.Diem_QT,
        kq.Diem_GK,
        kq.Diem_TH,
        kq.Diem_CK,
        kq.Diem_HP,
        CASE
          WHEN kq.Diem_HP >= 8.5 THEN 'A'
          WHEN kq.Diem_HP >= 8.0 THEN 'B+'
          WHEN kq.Diem_HP >= 7.0 THEN 'B'
          WHEN kq.Diem_HP >= 6.5 THEN 'C+'
          WHEN kq.Diem_HP >= 5.5 THEN 'C'
          WHEN kq.Diem_HP >= 5.0 THEN 'D+'
          ELSE 'F'
        END AS Xep_Loai,
        kq.GHI_CHU,
        CONCAT(${Nam_Nhap_Hoc} + FLOOR((kq.Hoc_Ky-1)/2), '-', ${Nam_Nhap_Hoc} + FLOOR((kq.Hoc_Ky-1)/2) + 1) AS Nam_Hoc
      FROM KETQUA kq
      JOIN DANGKY dk ON kq.Ma_Mon_Hoc = dk.Ma_Mon_Hoc AND dk.Ma_Sinh_Vien = kq.Ma_Sinh_Vien
      LEFT JOIN MONHOC mh ON dk.LOAI = 'chinh' AND mh.Ma_Mon_Hoc = dk.Ma_Mon_Hoc AND mh.Ma_Nganh = ? AND mh.Khoa = ?
      LEFT JOIN MONHOC_KHAC mhk ON dk.LOAI = 'khac' AND mhk.Ma_Mon_Hoc = dk.Ma_Mon_Hoc AND mhk.Ma_Nganh = ? AND mhk.Khoa = ?
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY kq.Hoc_Ky DESC, Ten_Mon_Hoc ASC
    `;

    return {
      sql: sqlQuery,
      params: [Ma_Nganh, Khoa, Ma_Nganh, Khoa, ...queryParams]
    };
  } catch (error) {
    console.error("Lỗi khi xây dựng query:", error);
    throw new Error("Không thể xây dựng câu truy vấn");
  }
};

// Hàm xử lý kết quả
const processResults = (results) => {
  const processedResults = results.map(item => ({
    ...item,
    So_TC: item.So_TC || 0
  }));

  const stats = {
    tongMon: processedResults.length,
    tongTC: processedResults.reduce((sum, item) => sum + item.So_TC, 0),
    diemTB: processedResults.length > 0 
      ? parseFloat((processedResults.reduce((sum, item) => sum + item.Diem_HP, 0) / processedResults.length).toFixed(2))
      : 0
  };

  return { processedResults, stats };
};

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "Token không hợp lệ!",
      solution: "Vui lòng đăng nhập lại"
    });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    req.decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: error.message,
      solution: "Vui lòng đăng nhập lại"
    });
  }
};

// Lấy thông tin sinh viên
const getStudentInfo = async (mssv) => {
  try {
    const [[studentInfo]] = await db.query(`
      SELECT Nam_Nhap_Hoc, Ma_Nganh
      FROM SINHVIEN
      WHERE Ma_Sinh_Vien = ?
    `, [mssv]);

    if (!studentInfo) {
      throw new Error("Không tìm thấy thông tin sinh viên");
    }

    return {
      Nam_Nhap_Hoc: studentInfo.Nam_Nhap_Hoc,
      Ma_Nganh: studentInfo.Ma_Nganh,
      Khoa: `K${studentInfo.Nam_Nhap_Hoc - 2005}`
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sinh viên:", error);
    throw error;
  }
};

// Controller chính
const getCompletedCourses = [
  authenticateToken,
  async (req, res) => {
    try {
      const { hocKy, namHoc } = req.query;
      const studentId = req.decodedToken.Tai_Khoan;

      // Validate MSSV
      const validation = validateMSSV(studentId);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
          details: validation
        });
      }

      // Lấy thông tin sinh viên
      const studentInfo = await getStudentInfo(validation.mssv);
      const { Nam_Nhap_Hoc, Ma_Nganh } = studentInfo;

      // Xây dựng và thực thi query
      const query = buildQuery(validation.mssv, Nam_Nhap_Hoc, Ma_Nganh, { hocKy, namHoc });
      if (!query || !query.sql) {
        throw new Error("Không thể xây dựng câu truy vấn");
      }

      const [results] = await db.query(query.sql, query.params);
      const { processedResults, stats } = processResults(results);

      res.json({
        success: true,
        data: processedResults,
        stats,
        metadata: {
          studentId: validation.mssv,
          Ma_Nganh,
          Khoa: studentInfo.Khoa,
          hocKy: hocKy || "Tất cả",
          namHoc: namHoc || "Tất cả"
        }
      });

    } catch (error) {
      console.error("Lỗi trong getCompletedCourses:", error);
      
      const statusCode = error.message.includes("Không tìm thấy") ? 404 : 500;
      
      res.status(statusCode).json({ 
        success: false,
        message: error.message || "Lỗi server",
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
];

// Controller xem theo MSSV
const getCompletedCoursesByMSSV = [
  authenticateToken,
  async (req, res) => {
    try {
      const { hocKy, namHoc } = req.query;
      const mssv = req.params.mssv || req.headers['x-student-mssv'];

      // Validate MSSV
      const validation = validateMSSV(mssv);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
          details: validation
        });
      }

      // Kiểm tra quyền (sinh viên chỉ được xem điểm của mình)
      if (req.decodedToken.role === 'student' && req.decodedToken.Tai_Khoan !== validation.mssv) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xem điểm của sinh viên khác"
        });
      }

      // Lấy thông tin sinh viên
      const studentInfo = await getStudentInfo(validation.mssv);
      const { Nam_Nhap_Hoc, Ma_Nganh } = studentInfo;

      // Xây dựng và thực thi query
      const query = buildQuery(validation.mssv, Nam_Nhap_Hoc, Ma_Nganh, { hocKy, namHoc });
      if (!query || !query.sql) {
        throw new Error("Không thể xây dựng câu truy vấn");
      }

      const [results] = await db.query(query.sql, query.params);
      const { processedResults, stats } = processResults(results);

      res.json({
        success: true,
        data: processedResults,
        stats,
        metadata: {
          mssv: validation.mssv,
          Ma_Nganh,
          Khoa: studentInfo.Khoa,
          hocKy: hocKy || "Tất cả",
          namHoc: namHoc || "Tất cả"
        }
      });

    } catch (error) {
      console.error("Lỗi trong getCompletedCoursesByMSSV:", error);
      
      const statusCode = error.message.includes("Không tìm thấy") ? 404 : 500;
      
      res.status(statusCode).json({ 
        success: false,
        message: error.message || "Lỗi server",
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        receivedMSSV: req.params.mssv || req.headers['x-student-mssv']
      });
    }
  }
];

// Controller mới cho route /api/current
const getCurrentStudentCourses = [
    authenticateToken,
    async (req, res) => {
      try {
        const { hocKy, namHoc } = req.query;
        
        // Ưu tiên lấy MSSV từ params trước
        let mssv = req.params.mssv;
        
        // Nếu không có thì lấy từ header
        if (!mssv) {
          mssv = req.headers['x-student-mssv'];
        }
        
        // Validate MSSV
        const validation = validateMSSV(mssv);
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            message: validation.message,
            details: validation
          });
        }

      // Kiểm tra quyền (nếu cần)
      if (req.decodedToken.role === 'student' && req.decodedToken.Tai_Khoan !== validation.mssv) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền truy cập thông tin sinh viên khác"
        });
      }

      // Lấy thông tin sinh viên
      const studentInfo = await getStudentInfo(validation.mssv);
      const { Nam_Nhap_Hoc, Ma_Nganh, Khoa } = studentInfo;

      // Xây dựng và thực thi query
      const query = buildQuery(validation.mssv, Nam_Nhap_Hoc, Ma_Nganh, { hocKy, namHoc });
      const [results] = await db.query(query.sql, query.params);

      const { processedResults, stats } = processResults(results);

      res.json({
        success: true,
        data: processedResults,
        stats,
        metadata: {
          mssv: validation.mssv,
          Ma_Nganh,
          Khoa,
          hocKy: hocKy || "Tất cả",
          namHoc: namHoc || "Tất cả",
          requestedBy: req.decodedToken.Tai_Khoan
        }
      });

    } catch (error) {
      console.error("Lỗi trong getCurrentStudentCourses:", error);
      
      res.status(500).json({ 
        success: false,
        message: error.message || "Lỗi server",
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
];
// upload bảng điểm
const uploadTranscript = [
  authenticateToken,
  async (req, res) => {
    try {
      const {studentInfo, results} = req.body;
      const userMSSV = req.decodedToken.Tai_Khoan;

      // xác thực mssv từ file html
      const validation = validateMSSV(studentInfo.mssv);
      if (!validation.isValid) {
          return res.status(400).json({
          success: false,
          message: validation.message,
          details: validation
        });
      }

      // ktra quyền
      if (userMSSV != validation.mssv) {
        return res.status(403).json({
          success: false,
          message: "Bạn chỉ có thể cập nhật bảng điểm của chính mình"
        });
      }

      // lấy tt sinh viên
      const dbStudentInfo = await getStudentInfo(validation.mssv);
      const { Nam_Nhap_Hoc, Ma_Nganh, Khoa } = dbStudentInfo;

      // query
      await db.query('START TRANSACTION');
      try {
          await db.query(`
          UPDATE SINHVIEN 
          SET Ho_Ten = ?, Ma_Lop = ?, Ma_Khoa = ?
          WHERE Ma_Sinh_Vien = ?
        `, [
          studentInfo.hoTen,
          studentInfo.lop,
          studentInfo.khoa,
          validation.mssv
        ]);
        const skippedResults = [];
        for (const result of results) {
          const { hocKy, namHoc, maMonHoc, tenMonHoc, soTC, diemQT, diemGK, diemTH, diemCK, diemHP, ghiChu } = result;
          // Validate result
          if (!hocKy || !namHoc || !maMonHoc || !tenMonHoc || soTC < 0) {
            skippedResults.push({ maMonHoc: maMonHoc || 'unknown', error: 'Thiếu hoặc sai thông tin học kỳ/năm học/môn học' });
            continue;
          }
          if (!/^\d{4}-\d{4}$/.test(namHoc)) {
            skippedResults.push({ maMonHoc, error: 'Năm học không đúng định dạng YYYY-YYYY' });
            continue;
          }
          if (!/^\d+$/.test(hocKy)) {
            skippedResults.push({ maMonHoc, error: 'Học kỳ phải là số' });
            continue;
          }
          // Tính Hoc_Ky dựa trên namHoc và hocKy
          const [startYear] = namHoc.split('-').map(Number);
          const expectedHocKy = (startYear - Nam_Nhap_Hoc) * 2 + parseInt(hocKy);
          // Kiểm tra môn học trong bảng MONHOC hoặc MONHOC_KHAC
          let [[monHoc]] = await db.query(`
            SELECT Ma_Mon_Hoc, LOAI 
            FROM (
              SELECT Ma_Mon_Hoc, 'chinh' AS LOAI 
              FROM MONHOC 
              WHERE Ma_Mon_Hoc = ? AND Ma_Nganh = ? AND Khoa = ?
              UNION
              SELECT Ma_Mon_Hoc, 'khac' AS LOAI 
              FROM MONHOC_KHAC 
              WHERE Ma_Mon_Hoc = ? AND Ma_Nganh = ? AND Khoa = ?
            ) AS mon
          `, [maMonHoc, Ma_Nganh, dbStudentInfo.Khoa, maMonHoc, Ma_Nganh, dbStudentInfo.Khoa]);

          if (!monHoc) {
            // Thêm môn học mới vào MONHOC_KHAC nếu chưa tồn tại
            await db.query(`
              INSERT INTO MONHOC_KHAC (Ma_Mon_Hoc, Ten_Mon_Hoc, Tin_Chi_LT, Ma_Nganh, Khoa)
              VALUES (?, ?, ?, ?, ?)
            `, [maMonHoc, tenMonHoc, soTC, Ma_Nganh, dbStudentInfo.Khoa]);
            monHoc = { Ma_Mon_Hoc: maMonHoc, LOAI: 'khac' };
          }

          // Kiểm tra hoặc thêm Ma_Lop_Hoc vào bảng lichhoc
          const [[lopHoc]] = await db.query(`
            SELECT Ma_Lop_Hoc 
            FROM LICHHOC
            WHERE Ma_Mon_Hoc = ?
          `, [maMonHoc]);
          if (!lopHoc) {
            skippedResults.push({ maMonHoc, error: `Không tìm thấy lớp học cho môn ${maMonHoc} trong bảng lichhoc` });
            continue;
          }
          // if (!lopHoc) {
          //   await db.query(`
          //     INSERT INTO lichhoc (Ma_Lop_Hoc, Ma_Mon_Hoc, Hoc_Ky, Nam_Hoc)
          //     VALUES (?, ?, ?, ?)
          //   `, [maMonHoc, maMonHoc, hocKy, namHoc]);
          // }

          // Kiểm tra đăng ký môn học
          const [[dangKy]] = await db.query(`
            SELECT Ma_Sinh_Vien 
            FROM DANGKY 
            WHERE Ma_Sinh_Vien = ? AND Ma_Mon_Hoc = ?
          `, [validation.mssv, maMonHoc]);

          if (!dangKy) {
            await db.query(`
              INSERT INTO DANGKY (Ma_Sinh_Vien, Ma_Mon_Hoc, Ma_Lop_Hoc , LOAI, Hoc_Ki)
              VALUES (?, ?, ?, ?, ?)
            `, [validation.mssv, maMonHoc, lopHoc.Ma_Lop_Hoc, monHoc.LOAI, hocKy]);
          }

          // Cập nhật hoặc thêm kết quả học tập
          await db.query(`
            INSERT INTO KETQUA (Ma_Sinh_Vien, Ma_Mon_Hoc, Hoc_Ky, Diem_QT, Diem_GK, Diem_TH, Diem_CK, Diem_HP, GHI_CHU)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              Diem_QT = VALUES(Diem_QT),
              Diem_GK = VALUES(Diem_GK),
              Diem_TH = VALUES(Diem_TH),
              Diem_CK = VALUES(Diem_CK),
              Diem_HP = VALUES(Diem_HP),
              GHI_CHU = VALUES(GHI_CHU)
          `, [
            validation.mssv,
            maMonHoc,
            expectedHocKy,
            diemQT,
            diemGK,
            diemTH,
            diemCK,
            diemHP,
            ghiChu
          ]);
        }

        await db.query('COMMIT');
        res.json({
          success: true,
          message: 'Cập nhật bảng điểm thành công',
          skippedResults: skippedResults
        });
      }
      catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
    }
    catch (error) {
      console.error("Lỗi trong uploadTranscript:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi cập nhật bảng điểm",
      });
    }
  }
];

module.exports = { 
  getCompletedCourses,
  getCompletedCoursesByMSSV,
  getCurrentStudentCourses,
  authenticateToken,
  validateMSSV,
  uploadTranscript
};