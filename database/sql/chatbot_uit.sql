-- test and change
drop database chatbot_uit;
CREATE DATABASE CHATBOT_UIT;
USE CHATBOT_UIT;
show tables;
select * from SINHVIEN;
drop table SINHVIEN;
drop table lichhoc;
drop table dangky;
SELECT * FROM MONHOC;
SELECT * FROM USER;
-- create table
CREATE TABLE SINHVIEN (
	Ma_Sinh_Vien VARCHAR(20) PRIMARY KEY,
	Ho_Ten VARCHAR(255) NOT NULL,
	Gioi_Tinh VARCHAR(10),
	Ngay_Sinh DATE,
	Noi_Sinh VARCHAR(255),
	Tinh_Trang VARCHAR(50),
	Nam_Nhap_Hoc INT,
	Ma_Lop VARCHAR(20),
	Ma_Khoa VARCHAR(20),
	Ma_Nganh VARCHAR(20),
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
	Dia_Chi_Bao_Ho VARCHAR(255)
);

CREATE TABLE MONHOC (
	Khoa VARCHAR(5),
    Ma_Nganh VARCHAR(20),
	Ma_Mon_Hoc VARCHAR(20), 
    Ten_Mon_Hoc VARCHAR(255),
    Hoc_Ki INT,
    Tin_chi_LT INT,
    Tin_chi_TH INT,
    Ma_Mon_Tien_Quyet VARCHAR(20),
    PRIMARY KEY (Khoa, Ma_Nganh, Ma_Mon_Hoc)
);

CREATE TABLE MONHOC_KHAC (
	Khoa VARCHAR(5),
    Ma_Nganh VARCHAR(20),
	Ma_Mon_Hoc VARCHAR(20), 
    Ten_Mon_Hoc VARCHAR(255),
    Tin_chi_LT INT,
    Tin_chi_TH INT,
    Loai VARCHAR(20),
    PRIMARY KEY (Khoa, Ma_Nganh, Ma_Mon_Hoc)
);

CREATE TABLE KETQUA (
	Ma_Sinh_Vien VARCHAR(20) ,
    Ma_Mon_Hoc VARCHAR(20), 
    Hoc_Ky INT,
	Diem_QT FLOAT, 
    Diem_GK FLOAT, 
    Diem_TH FLOAT,
    Diem_CK FLOAT,
    Diem_HP FLOAT, 
    GHI_CHU VARCHAR(50),
    PRIMARY KEY (Hoc_Ky, Ma_Mon_Hoc, Ma_Sinh_Vien)
); 
CREATE TABLE USER(
    Tai_Khoan VARCHAR(20) PRIMARY KEY, 
    Mat_Khau VARCHAR(255) NOT NULL, 
    Vai_Tro ENUM('SinhVien', 'GiangVien', 'TruongKhoa') NOT NULL
);
CREATE TABLE NGANH (
    Ma_Nganh VARCHAR(20) PRIMARY KEY,
    Ten_Nganh VARCHAR(255),
    So_Tin_Chi INT,
    Ma_Khoa VARCHAR(20),
    Mo_Ta VARCHAR(255)
);
CREATE TABLE LOP(
    Ma_Lop VARCHAR(20) PRIMARY KEY,
    Ten_Lop VARCHAR(255) NOT NULL,
    So_Luong INT,
    Co_Van_Hoc_Tap VARCHAR(20)
);
CREATE TABLE GIANGVIEN(
    Ma_Giang_Vien VARCHAR(20) PRIMARY KEY,
    Ho_Ten VARCHAR(255),
    Gioi_Tinh VARCHAR(10),
    Ngay_Sinh DATE,
    Noi_Sinh VARCHAR(255),
    Ma_Khoa VARCHAR(10),
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
    Thuong_Tru VARCHAR(255),
    Quan_Huyen VARCHAR(255),
    Phuong_Xa VARCHAR(255),
    Tinh_Tp VARCHAR(255),
    Dia_Chi_Tam_Tru VARCHAR(255),
    Hoc_Vi VARCHAR(10),
    Hoc_Ham VARCHAR(50),
    He_So FLOAT,
    Muc_Luong INT
);
CREATE TABLE KHOA(
	Ma_Khoa VARCHAR(20) PRIMARY KEY,
    Ten_Khoa VARCHAR(255),
    Ma_Truong_Khoa VARCHAR(20)
);
CREATE TABLE DANGKY(
	Ma_Sinh_Vien VARCHAR(20),
	Ma_Mon_Hoc VARCHAR(20),
	Ma_Lop_Hoc VARCHAR(20),
	PRIMARY KEY (Ma_Sinh_Vien, Ma_Mon_Hoc, Ma_Lop_Hoc)
);
CREATE TABLE LICHHOC(
    Ma_Lop_Hoc VARCHAR(20) PRIMARY KEY,
    Thu INT,
    Tiet_Bat_Dau INT,
    Tiet_Ket_Thuc INT
);


-- set foreign key
ALTER TABLE MONHOC ADD CONSTRAINT fk_monhoc_truoc FOREIGN KEY (Ma_Mon_Tien_Quyet) REFERENCES MONHOC(Ma_Mon_Hoc);
ALTER TABLE MONHOC ADD CONSTRAINT fk_makhoa_monhoc FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);

ALTER TABLE KETQUA ADD CONSTRAINT fk_ketqua_sinhvien FOREIGN KEY (Ma_Sinh_Vien) REFERENCES SINHVIEN(Ma_Sinh_Vien);
ALTER TABLE KETQUA ADD CONSTRAINT fk_ketqua_monhoc FOREIGN KEY (Ma_Mon_Hoc) REFERENCES MONHOC(Ma_Mon_Hoc);

ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_lop FOREIGN KEY (Ma_Lop) REFERENCES LOP(Ma_Lop);
ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_nganh FOREIGN KEY (Ma_Nganh) REFERENCES NGANH(Ma_Nganh);
ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_khoa FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);
ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_user FOREIGN KEY (Ma_Sinh_Vien) REFERENCES USER(Tai_Khoan);

ALTER TABLE NGANH ADD CONSTRAINT fk_nganh_khoa FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);

ALTER TABLE LOP ADD CONSTRAINT fk_lop_giangvien FOREIGN KEY (Co_Van_Hoc_Tap) REFERENCES GIANGVIEN(Ma_Giang_Vien);

ALTER TABLE GIANGVIEN ADD CONSTRAINT fk_giangvien_khoa FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);
ALTER TABLE GIANGVIEN ADD CONSTRAINT fk_giangvien_user FOREIGN KEY (Ma_Giang_Vien) REFERENCES USER(Tai_Khoan);

ALTER TABLE KHOA ADD CONSTRAINT fk_khoa_truongkhoa FOREIGN KEY (Ma_Truong_Khoa) REFERENCES GIANGVIEN(Ma_Giang_Vien);

ALTER TABLE DANGKY ADD CONSTRAINT fk_dangky_sinhvien FOREIGN KEY (Ma_Sinh_Vien) REFERENCES SINHVIEN(Ma_Sinh_Vien);
ALTER TABLE DANGKY ADD CONSTRAINT fk_dangky_monhoc FOREIGN KEY (Ma_Mon_Hoc) REFERENCES MONHOC(Ma_Mon_Hoc);
ALTER TABLE DANGKY ADD CONSTRAINT fk_dangky_lophoc FOREIGN KEY (Ma_Lop_Hoc) REFERENCES LICHHOC(Ma_Lop_Hoc);


