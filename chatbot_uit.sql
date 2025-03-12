CREATE DATABASE CHATBOT_UIT;
USE CHATBOT_UIT;
CREATE TABLE SINHVIEN (
    Ma_Sinh_Vien VARCHAR(20) PRIMARY KEY,
    Ho_Ten VARCHAR(255) NOT NULL,
    Gioi_Tinh VARCHAR(10),
    Ngay_Sinh DATE,
    Noi_Sinh VARCHAR(255),
    Tinh_Trang VARCHAR(50),
    Lop VARCHAR(50),
    Khoa VARCHAR(255),
    He_Dao_Tao VARCHAR(255),
    Email_Truong VARCHAR(255),
    Email_Ca_Nhan VARCHAR(255),
    Dien_Thoai VARCHAR(15),
    So_CMND VARCHAR(20),
    Ngay_Cap_CMND DATE,
    Noi_Cap_CMND VARCHAR(255),
    Dan_Toc VARCHAR(50),
    Ton_Giao VARCHAR(50),
    Xuat_Than VARCHAR(50),
    Ngay_Vao_Doan DATE,
    Ngay_Vao_Dang DATE,
    Ho_Ten_Cha VARCHAR(255),
    Nghe_Nghiep_Cha VARCHAR(255),
    SDT_Cha VARCHAR(15),
    Ho_Ten_Me VARCHAR(255),
    Nghe_Nghiep_Me VARCHAR(255),
    SDT_Me VARCHAR(15),
    Ho_Ten_Bao_Ho VARCHAR(255),
    Thuong_Tru VARCHAR(255),
    Quan_Huyen VARCHAR(255),
    Phuong_Xa VARCHAR(255),
    Tinh_Tp VARCHAR(255),
    Dia_Chi_Tam_Tru VARCHAR(255),
    Dia_Chi_Cha VARCHAR(255),
    Dia_Chi_Me VARCHAR(255),
    Dia_Chi_Bao_Ho VARCHAR(255),
    FOREIGN KEY (Ma_Lop) REFERENCES LOP(Ma_Lop),
    FOREIGN KEY (Ma_Nganh) REFERENCES NGANH(Ma_Nganh),
    FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa),
    FOREIGN KEY (username) REFERENCES TAIKHOAN(username),
);
-- SELECT * FROM STUDENTS
CREATE TABLE KETQUA (
	Ma_Sinh_Vien VARCHAR(20) ,
    HOCKY INT,
    Ma_Mon_Hoc CHAR(5), 
	Diem_QT FLOAT, 
    Diem_GK FLOAT, 
    Diem_TH FLOAT,
    Diem_CK FLOAT,
    Diem_HP FLOAT, 
    GHI_CHU VARCHAR(10),
    PRIMARY KEY (HOCKY, Ma_Mon_Hoc, Ma_Sinh_Vien),
    FOREIGN KEY (Ma_Sinh_Vien) REFERENCES SINHVIEN(Ma_Sinh_Vien),
	FOREIGN KEY (Ma_Mon_Hoc) REFERENCES MONHOC(Ma_Mon_Hoc)
);

CREATE TABLE MONHOC (
	Ma_Mon_Hoc CHAR(5) PRIMARY KEY, 
    Ten_Mon_Hoc varchar(40),
    Tin_chi_LT int,
    Tin_chi_TH int,
    Ngay_BD datetime, 
    Ngay_KT datetime,
    Ma_Mon_Hoc_Truoc CHAR(5)
);

CREATE TABLE LOP(
    Ma_Lop VARCHAR(10) PRIMARY KEY,
    Ten_Lop VARCHAR(255) NOT NULL,
    So_Luong INT,
    Co_Van_Hoc_Tap varchar(20)
);

CREATE TABLE GIANGVIEN(
    Ma_Giang_Vien VARCHAR(20) PRIMARY KEY,
    Day_Mon VARCHAR(20),
    Ho_Ten VARCHAR(255),
    Gioi_Tinh VARCHAR(10),
    Ngay_Sinh DATE,
    Noi_Sinh VARCHAR(255),
    Khoa VARCHAR(10),
    Email_Truong VARCHAR(255),
    Email_Ca_Nhan VARCHAR(255),
    username VARCHAR(50),
    Dien_Thoai VARCHAR(15),
    So_CMND VARCHAR(20),
    Ngay_Cap_CMND DATE,
    Noi_Cap_CMND VARCHAR(255),
    Dan_Toc VARCHAR(50),
    Ton_Giao VARCHAR(50),
    Xuat_Than VARCHAR(50),
    Ngay_Vao_Doan DATE,
    Ngay_Vao_Dang DATE,
    Ho_Ten_Cha VARCHAR(255),
    Nghe_Nghiep_Cha VARCHAR(255),
    SDT_Cha VARCHAR(15),
    Ho_Ten_Me VARCHAR(255),
    Nghe_Nghiep_Me VARCHAR(255),
    SDT_Me VARCHAR(15),
    Thuong_Tru VARCHAR(255),
    Quan_Huyen VARCHAR(255),
    Phuong_Xa VARCHAR(255),
    Tinh_Tp VARCHAR(255),
    Dia_Chi_Tam_Tru VARCHAR(255),
    Hoc_Vi VARCHAR(10),
    Hoc_Ham VARCHAR(10),
    He_So FLOAT,
    Muc_Luong INT,
    FOREIGN KEY (Day_Mon) REFERENCES MONHOC(Ma_Mon_Hoc),
    FOREIGN KEY (Khoa) REFERENCES KHOA(Ma_Khoa)
);






