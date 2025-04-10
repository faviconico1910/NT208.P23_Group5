INSERT INTO MONHOC (Khoa, Ma_Nganh,  Ma_Mon_Hoc, Ten_Mon_Hoc, Hoc_Ki, Tin_chi_LT, Tin_chi_TH, Ma_Mon_Hoc_Truoc) VALUES
('K19','ATTT','IT001','Nhập môn lập trình',1,3,1,NULL),
('K19','ATTT','MA006','Giải tích',1,4,0,NULL),
('K19','ATTT','MA003','Đại số tuyến tính',1,3,0,NULL),
('K19','ATTT','PH002','Nhập môn mạch số',1,3,1,NULL),
('K19','ATTT','NT015','Giới thiệu ngành ATTT',1,1,0,NULL),
('K19','ATTT','ENG01','Anh văn 1',1,4,0,NULL),
('K19','ATTT','ME001','Giáo dục quốc phòng',1,0,0,NULL),

('K19','ATTT','IT002','Lập trình hướng đối tượng',2,3,1,NULL),
('K19','ATTT','IT005','Nhập môn mạng máy tính',2,3,1,NULL),
('K19','ATTT','MA004','Cấu trúc rời rạc',2,4,0,NULL),
('K19','ATTT','IT006','Kiến trúc máy tính',2,3,0,NULL),
('K19','ATTT','SS006','Pháp luật đại cương',2,2,0,NULL),
('K19','ATTT','ENG02','Anh văn 2',2,4,0,'ENG01'),

('K19','ATTT','IT004','Cơ sở dữ liệu',3,3,1,NULL),
('K19','ATTT','NT209','Lập trình hệ thống',3,2,1,NULL),
('K19','ATTT','IT003','Cấu trúc dữ liệu và giải thuật',3,3,1,NULL),
('K19','ATTT','SS004','Kỹ năng nghề nghiệp',3,2,0,NULL),
('K19','ATTT','MA005','Xác suất thống kê',3,3,0,NULL),
('K19','ATTT','ENG03','Anh văn 3',3,4,0,'ENG02'),

('K19','ATTT','IT007','Hệ điều hành',4,3,1,NULL),
('K19','ATTT','NT106','Lập trình mạng căn bản',4,2,1,NULL),
('K19','ATTT','NT219','Mật mã học',4,2,1,NULL),
('K19','ATTT','NT208','Lập trình ứng dụng Web',4,2,1,NULL),
('K19','ATTT','SS010','Lịch sử Đảng Cộng sản Việt Nam',4,2,0,NULL),
('K19','ATTT','SS007','Triết học Mác - Lênin',4,3,0,NULL),
('K19','ATTT','PE231','Giáo dục thể chất 1',4,0,0,NULL),

('K19','ATTT','SS008','Kinh tế chính trị Mác- Lênin',5,2,0,NULL),
('K19','ATTT','SS009','Chủ nghĩa xã hội khoa học',5,2,0,NULL),
('K19','ATTT','NT132','Quản trị mạng và hệ thống',5,3,1,NULL),
('K19','ATTT','NT140','An toàn mạng',5,3,1,NULL),
('K19','ATTT','NT521','Lập trình an toàn và khai thác lỗ hổng phần mềm',5,3,1,NULL),
('K19','ATTT','HPCN1','Học phần chuyên ngành 2',5,2,1,NULL),
('K19','ATTT','PE232','Giáo dục thể chất 2',5,0,0,NULL),

('K19','ATTT','NT230','Cơ chế hoạt động của mã độc',6,2,1,NULL),
('K19','ATTT','SS003','Tư tưởng Hồ Chí Minh',6,2,0,NULL),
('K19','ATTT','NT114','Đồ án chuyên ngành',6,0,2,NULL),
('K19','ATTT','HPCN2','Học phần chuyên ngành 2',6,2,1,NULL),
('K19','ATTT','HPCN3','Học phần chuyên ngành 3',6,2,1,NULL),
('K19','ATTT','HPTC1','Học phần tự chọn 1',6,2,1,NULL),

('K19','ATTT','NT215','Thực tập doanh nghiệp',7,2,0,NULL),
('K19','ATTT','HPTC2','Học phần tự chọn 2',7,2,1,NULL),
('K19','ATTT','NT505','Khóa luận tốt nghiệp',7,10,0,NULL),
('K19','ATTT','CDTN1','Môn chuyên đề tốt nghiệp 1',7,10,0,NULL),
('K19','ATTT','CDTN2','Môn chuyên đề tốt nghiệp 2',7,6,0,NULL),
('K19','ATTT','CDTN3','Môn chuyên đề tốt nghiệp 3',7,4,0,NULL),

INSERT INTO MONHOC_KHAC (Khoa, Ma_Nganh, Ma_Mon_Hoc, Ten_Mon_Hoc, Tin_chi_LT, Tin_chi_TH, Ma_Mon_Hoc_Truoc, Loai) VALUES
('K19','ATTT','NT204','Hệ thống tìm kiếm, phát hiện và ngăn ngừa xâm nhập',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT330','An toàn mạng không dây và di động',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT207','Quản lý rủi ro và an toàn thông tin trong doanh nghiệp',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT137','Kỹ thuật phân tích mã độc',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT213','Bảo mật web và ứng dụng',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT334','Pháp chứng kỹ thuật số',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT535','Bảo mật Internet of things',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT211','An ninh nhân sự, định danh và chứng thực',3,1,NULL,'chuyên ngành'),
('K19','ATTT','NT212','An toàn dữ liệu, khôi phục thông tin sau sự cố',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT534','An toàn mạng máy tính nâng cao',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT133','An toàn kiến trúc hệ thống',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT523','An toàn thông tin trong kỷ nguyên Máy tính lượng tử',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT205','Tấn công mạng',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT547','Blockchain: nền tảng, ứng dụng và bảo mật',2,1,NULL,'chuyên ngành'),
('K19','ATTT','NT118','Phát triển ứng dụng trên thiết bị di động',2,1,NULL,'chuyên ngành'),

('K19','ATTT','NT541','Công nghệ mạng khả lập trình',3,1,NULL,'chuyên đề'),
('K19','ATTT','NT533','Hệ tính toán phân bố',2,1,NULL,'chuyên đề'),
('K19','ATTT','NT522','Phương pháp học máy trong an toàn thông tin',2,1,NULL,'chuyên đề'),