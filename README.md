###  Chatbot tư vấn học tập UIT
# 📝 Giới thiệu
---
Hệ thống chatbot tư vấn, lên kế hoạch học tập, giải đáp thắc mắc học vụ tự động dựa trên chương trình đào tạo và kết quả, tiến độ học tập cho sinh viên UIT
## Mục tiêu hệ thống
- Theo dõi điểm số, lịch học
- Tư vấn môn học phù hợp học kỳ tiếp theo
- Giải đáp thắc mắc về học vụ, môn học, đăng ký, xét tốt nghiệp...
- Giao diện đơn giản, dễ sử dụng
- Hệ thống mở rộng được (cho admin, giáo viên)
  
# 👨‍👩‍👧‍👦 Thành viên

<a href="https://github.com/faviconico1910/NT208.P23_Group5/graphs/contributors"> 
   <img src="https://contrib.rocks/image?repo=faviconico1910/NT208.P23_Group5" />
</a>

| MSSV      | Họ và Tên   | Lớp|  
|-----------|------------|----------
| 23521179   |Đậu Đức An Phú  | ATTT2023.2 |
| 23520501  |  Đặng Hiểu Hòa   | ATTT2023.1 | 
| 23520144   | Trương Quốc Bảo    | ATTT2023.1  |
| 23520830 | Khiếu Bảo Lâm      | ATTT2023.1   |
| 23520737  | Huỳnh Đăng Khoa | ATTT2023.1   |



## ⚙️ Công nghệ sử dụng

- **Backend**: Node.js (Express.js)
- 🧠 **AI**: Gemini-1.5flash
- 🗄️ **CSDL**: MySQL
- 🔒 **Xác thực**: JWT (JSON Web Token)
-  **Frontend**: HTML/CSS/JS thuần (Bootstrap)
-  **Giao tiếp AI - DB**: Text-to-SQL
## 🚀 Deployment
Hệ thống đã được triển khai thực tế trên máy chủ VPS:
- **VPS**: Vietnix
- **🌍**: ```uitchatbot.xyz``` từ ```porkbun.com```
- 🌐 **Web server**: Nginx (reverse proxy)
- **Backend**: Node.js chạy bằng PM2
- 🔐 **Bảo mật**: HTTPS thông qua Let's Encrypt
- 📦 **Database**: MySQL cài trực tiếp trên VPS
> Hệ thống có thể truy cập công khai thông qua domain riêng, hoạt động ổn định 24/7 trên Internet.
> 
⚓ Bắt đầu làm việc
---
1. Clone Repo
   
```bash
git clone https://github.com/faviconico1910/NT208.P23_Group5.git
```

2. Tạo branch mới

```bash
git branch <branch-name>
```
  
3. Chuyển nhánh và làm trên branch đó

```bash
git checkout <branch-name>
```

📦 Cài đặt và chạy hệ thống
---
1. Đổi DB_PASS
2. Chạy local
```bash
cd Backend
npm install
nodemon server.js
```
3. Xem web ở ``` http://localhost:3000 ```
---
> NT208.P23 - Nhóm 5  
> UIT - Trường Đại học CNTT - Đại học Quốc Gia TP.HCM
