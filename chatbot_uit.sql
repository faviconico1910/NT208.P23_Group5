-- test and change
drop database chatbot_uit;
CREATE DATABASE CHATBOT_UIT;
USE CHATBOT_UIT;
show tables;
select * from SINHVIEN;
drop table SINHVIEN;
drop table khoa;
drop table monhoc;

-- create table
CREATE TABLE SINHVIEN (
    Ma_Sinh_Vien VARCHAR(20) PRIMARY KEY,
    Ho_Ten VARCHAR(255) NOT NULL,
    Gioi_Tinh VARCHAR(10),
    Ngay_Sinh DATE,
    Noi_Sinh VARCHAR(255),
    Tinh_Trang VARCHAR(50),
    Ma_Lop VARCHAR(20),
    Ma_Khoa VARCHAR(20),
    Ma_Nganh VARCHAR(20),
    Tai_Khoan VARCHAR(20),
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
	Ma_Mon_Hoc VARCHAR(20) PRIMARY KEY, 
    Ten_Mon_Hoc VARCHAR(255),
    Ma_Khoa VARCHAR(20),
    Loai_MH VARCHAR(20),
    Hoc_Ki INT,
    Tin_chi_LT INT,
    Tin_chi_TH INT,
    Ma_Mon_Hoc_Truoc VARCHAR(20)
);


CREATE TABLE KETQUA (
	Ma_Sinh_Vien VARCHAR(20) ,
    Hoc_Ky INT,
    Ma_Mon_Hoc VARCHAR(20), 
	Diem_QT FLOAT, 
    Diem_GK FLOAT, 
    Diem_TH FLOAT,
    Diem_CK FLOAT,
    Diem_HP FLOAT, 
    GHI_CHU VARCHAR(50),
    PRIMARY KEY (Hoc_Ky, Ma_Mon_Hoc, Ma_Sinh_Vien)
); 

-- SELECT * FROM STUDENTS
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
    Tai_Khoan VARCHAR(20),
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
    Muc_Luong INT
);


CREATE TABLE KHOA(
	Ma_Khoa VARCHAR(20) PRIMARY KEY,
    Ten_Khoa VARCHAR(255),
    Ma_Truong_Khoa VARCHAR(20)
);


-- set foreign key
ALTER TABLE MONHOC ADD CONSTRAINT fk_monhoc_truoc FOREIGN KEY (Ma_Mon_Hoc_Truoc) REFERENCES MONHOC(Ma_Mon_Hoc);
ALTER TABLE MONHOC ADD CONSTRAINT fk_makhoa_monhoc FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);

ALTER TABLE KETQUA ADD CONSTRAINT fk_ketqua_sinhvien FOREIGN KEY (Ma_Sinh_Vien) REFERENCES SINHVIEN(Ma_Sinh_Vien);
ALTER TABLE KETQUA ADD CONSTRAINT fk_ketqua_monhoc FOREIGN KEY (Ma_Mon_Hoc) REFERENCES MONHOC(Ma_Mon_Hoc);

ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_lop FOREIGN KEY (Ma_Lop) REFERENCES LOP(Ma_Lop);
ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_nganh FOREIGN KEY (Ma_Nganh) REFERENCES NGANH(Ma_Nganh);
ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_khoa FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);
ALTER TABLE SINHVIEN ADD CONSTRAINT fk_sinhvien_user FOREIGN KEY (Tai_Khoan) REFERENCES USER(Tai_Khoan);

ALTER TABLE NGANH ADD CONSTRAINT fk_nganh_khoa FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);

ALTER TABLE LOP ADD CONSTRAINT fk_lop_giangvien FOREIGN KEY (Co_Van_Hoc_Tap) REFERENCES GIANGVIEN(Ma_Giang_Vien);

ALTER TABLE GIANGVIEN ADD CONSTRAINT fk_giangvien_khoa FOREIGN KEY (Ma_Khoa) REFERENCES KHOA(Ma_Khoa);
ALTER TABLE GIANGVIEN ADD CONSTRAINT fk_giangvien_user FOREIGN KEY (Tai_Khoan) REFERENCES USER(Tai_Khoan);

ALTER TABLE KHOA ADD CONSTRAINT fk_khoa_truongkhoa FOREIGN KEY (Ma_Truong_Khoa) REFERENCES GIANGVIEN(Ma_Giang_Vien);

SELECT * FROM KHOA;

INSERT INTO KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)
VALUES ('KH&KTTT', 'Khoa học và kĩ thuật thông tin', 'GV23');
INSERT INTO KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)
VALUES ('MMT&TT', 'Mạng máy tính và truyền thông', 'GV85');
INSERT INTO KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)
VALUES ('KHMT', 'Khoa học máy tính', 'GV96');
INSERT INTO KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)
VALUES ('KTMT', 'Kĩ thuật máy tính', 'GV55');
INSERT INTO KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)
VALUES ('CNPM', 'Công nghệ phần mềm', 'GV58');
INSERT INTO KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)
VALUES ('HTTT', 'Hệ thống thông tin', 'GV76');
INSERT INTO KHOA (Ma_Khoa, Ten_Khoa) VALUES ('Chung', 'Các môn học chung');

SELECT * FROM MONHOC;

INSERT INTO MONHOC (Ma_Mon_Hoc, Ten_Mon_Hoc, Ma_Khoa, Loai_MH, Hoc_Ki, Tin_chi_LT, Tin_chi_TH, Ma_Mon_Hoc_Truoc) VALUES 
('IT001', 'Nhập môn lập trình', 'KHMT', 'Chung', 1, 3, 1, null),
('IT002', 'Lập trình hướng đối tượng','CNPM', 'Chung',2, 3, 1, 'IT001'),
('IT003', 'Cấu trúc dữ liệu và giải thuật', 'KHMT','Chung', 3, 3, 1, 'IT001'),
('IT004', 'Cơ sở dữ liệu','HTTT', 'Chung',3, 3, 1, null),
('IT005', 'Nhập môn mạng máy tính','MMT&TT', 'Chung',2, 3, 1, null),
('IT006', 'Kiến trúc máy tính','KTMT', 'Chung',2, 3, 0, null),
('IT007', 'Hệ điều hành','KTMT', 'Chung',3, 3, 1, 'IT006'),
('PH002', 'Nhập môn mạch số','KTMT', 'Chung',1, 3, 1, null),
('MA003', 'Đại số tuyến tính','KH&KTTT', 'Chung',1, 3, 0, null),
('MA004', 'Cấu trúc rời rạc','KH&KTTT', 'Chung', 2, 3, 0, null),
('MA005', 'Xác suất thống kê','KH&KTTT', 'Chung', 3, 3, 0, null),
('MA006', 'Giải tích', 'KH&KTTT', 'Chung', 1, 4, 0, null),
('NT005', 'Giới thiệu ngành Mạng máy tính và Truyền thông dữ liệu','MMT&TT', 'MMT', 1, 1, 0, null), 
('NT101', 'An toàn mạng máy tính','MMT&TT', 'ATTT', 5, 3, 1, 'IT005'),
('NT105', 'Truyền dữ liệu','MMT&TT', 'MMT',5, 3, 1, null),
('NT106', 'Lập trình mạng căn bản','MMT&TT', 'Chung',4, 2, 1, null), 
('NT113', 'Thiết kế Mạng','MMT&TT', 'MMT', 5, 2, 1, null),
('NT114', 'Đồ án chuyên ngành','MMT&TT', 'Chung', 6, 0, 2, null),
('NT118', 'Phát triển ứng dụng trên thiết bị di động','MMT&TT', 'Chung',4, 2, 1, null),
('NT131', 'Hệ thống nhúng Mạng không dây','MMT&TT', 'MMT', 4, 3, 1, null),
('NT132', 'Quản trị mạng và hệ thống','MMT&TT', 'Chung', 5, 3, 1, null),  
('NT215', 'Thực tập doanh nghiệp','MMT&TT', 'Chung', 7, 2, 0, null), 
('NT505', 'Khóa luận tốt nghiệp','MMT&TT', 'Chung',7, 10, 0, null), 
('NT532', 'Công nghệ Internet of Things hiện đại','MMT&TT', 'MMT',6, 2, 1, null),
('NT536', 'Công nghệ truyền thông đa phương tiện','MMT&TT', 'MMT',6, 2, 1, null),
('NT538', 'Giải thuật xử lý song song và phân bố','MMT&TT', 'MMT',6, 2, 1, null),
('NT540', 'Mạng không dây thế hệ mới','MMT&TT', 'MMT',6, 2, 1, null),
('NT542', 'Lập trình kịch bản tự động hóa cho quản trị và bảo mật mạng','MMT&TT', 'MMT',6, 2, 1, null),
('NT543', 'Tín hiệu và hệ thống thông tin','MMT&TT', 'MMT',5, 2, 1, null),
('NT209', 'Lập trình hệ thống','MMT&TT', 'ATTT',3, 2, 1, null),
('NT204', 'Hệ thống tìm kiếm, phát hiện và ngăn ngừa xâm nhập','MMT&TT', 'ATTT',5, 2, 1, null),
('NT330', 'An toàn mạng không dây và di động','MMT&TT', 'ATTT',5, 2, 1, null),
('NT207', 'Quản lý rủi ro và an toàn thông tin trong doanh nghiệp', 'MMT&TT','ATTT', 6, 2, 1, null),
('NT137', 'Cơ chế hoạt động của mã độc','MMT&TT', 'ATTT',6, 2, 1, null),
('NT213', 'Bảo mật web và ứng dụng','MMT&TT', 'ATTT',5, 2, 1, null),
('NT334', 'Pháp chứng kỹ thuật số','MMT&TT', 'ATTT',6, 2, 1, null),
('NT535', 'Bảo mật Internet of Things','MMT&TT', 'Chung',6, 2, 1, null),
('NT534', 'An toàn mạng máy tính nâng cao','MMT&TT', 'ATTT', 6, 2, 1, null),
('NT133', 'An toàn kiến trúc hệ thống','MMT&TT', 'ATTT',5, 2, 1, null),
('NT523', 'An toàn thông tin trong kỷ nguyên Máy tính lượng tử','MMT&TT', 'ATTT', 6, 2, 1, null),
('NT205', 'Tấn công mạng','MMT&TT', 'ATTT', 5, 2, 1, null),
('NT547', 'Blockchain: nền tảng, ứng dụng và bảo mật','MMT&TT', 'ATTT',6, 2, 1, null),
('NT332', 'Xử lý tín hiệu trong Truyền thông','MMT&TT', 'MMT', 6, 3, 1, null),
('NT539', 'AI ứng dụng trong mạng và truyền thông','MMT&TT', 'MMT',6 ,3, 1, null),
('NT544', 'Ăng ten và truyền thông vô tuyến','MMT&TT', 'MMT', 7, 3, 1, null),
('NT545', 'Thiết kế hệ thống viễn thông','MMT&TT', 'MMT', 7, 2, 1, null),
('NT522', 'Phương pháp học máy trong an toàn thông tin','MMT&TT', 'ATTT', 6, 2, 1, null),
('SS003', 'Tư tưởng Hồ Chí Minh','Chung', 'Chung',6, 2, 0, null),
('SS004', 'Kỹ năng nghề nghiệp','Chung', 'Chung', 3, 2, 0, null),
('SS006', 'Pháp luật đại cương','Chung', 'Chung', 2, 2, 0, null),
('SS007', 'Triết học Mác Lênin','Chung', 'Chung', 4, 3, 0, null),
('SS008', 'Kinh tế chính trị Mác Lênin','Chung', 'Chung', 5, 2, 0, null),
('SS009', 'Chủ nghĩa xã hội khoa học','Chung', 'Chung',5, 2, 0, null),
('SS010', 'Lịch sử Đảng Cộng sản Việt Nam','Chung', 'Chung', 4, 2, 0, null),
('ENG01', 'Anh văn 1', 'Chung', 'Chung', 1, 4, 0, null),
('ENG02', 'Anh văn 2','Chung', 'Chung', 2, 4, 0, null),
('ENG03', 'Anh văn 3','Chung', 'Chung', 3, 4, 0, null),
('ME001', 'Giáo dục quốc phòng','Chung', 'Chung', 1, 0, 0, null),
('PE231', 'Giáo dục thể chất 1','Chung', 'Chung', 4, 0, 0, null),
('PE232', 'Giáo dục thể chất 2','Chung', 'Chung', 5, 0, 0, 'PE231');



