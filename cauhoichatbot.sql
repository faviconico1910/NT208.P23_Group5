CREATE TABLE CAUHOI_CHATBOT (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cau_hoi TEXT NOT NULL,
    cau_tra_loi TEXT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);