CREATE DATABASE StudentDB;
USE StudentDB;

CREATE TABLE students (
	Ma_Sinh_Vien VARCHAR(50) UNIQUE,
    Ho_Ten VARCHAR(255),
    Gioi_Tinh VARCHAR(10),
    Ngay_Sinh DATE,
    Noi_Sinh VARCHAR(255),
    Tinh_Trang VARCHAR(100),
    Lop VARCHAR(50),
    Khoa VARCHAR(255),
    He_Dao_Tao VARCHAR(100),
    Email_Truong VARCHAR(255),
    Email_Ca_Nhan VARCHAR(255),
    Dien_Thoai VARCHAR(15),
    So_CMND VARCHAR(20),
    Ngay_Cap_CMND DATE,
    Noi_Cap_CMND VARCHAR(255),
    Dan_Toc VARCHAR(50),
    Ton_Giao VARCHAR(50),
    Xuat_Than VARCHAR(100),
    Ngay_Vao_Doan DATE,
    Ngay_Vao_Dang DATE,
    Ho_Ten_Cha VARCHAR(255),
    Nghe_Nghiep_Cha VARCHAR(255),
    SDT_Cha VARCHAR(15),
    Ho_Ten_Me VARCHAR(255),
    Nghe_Nghiep_Me VARCHAR(255),
    SDT_Me VARCHAR(15),
    Ho_Ten_Bao_Ho VARCHAR(255),
    Thuong_Tru TEXT,
    Quan_Huyen VARCHAR(100),
    Phuong_Xa VARCHAR(100),
    Tinh_TP VARCHAR(100),
    Dia_Chi_Tam_Tru TEXT,
    Dia_Chi_Cha TEXT,
    Dia_Chi_Me TEXT,
    Dia_Chi_Bao_Ho TEXT,
    PRIMARY KEY (Ma_Sinh_Vien)
);

SELECT * FROM students
