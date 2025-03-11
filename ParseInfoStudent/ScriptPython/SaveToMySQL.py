import mysql.connector
from datetime import datetime

# Kết nối đến MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",      # Thay bằng username MySQL của bạn
    password="1305", # Thay bằng password MySQL của bạn
    database="StudentDB"
)
cursor = conn.cursor()

# Dữ liệu đã parse từ HTML (ví dụ)
student_data = {
    #Copy nội dung file outdata.txt vô đây
    "Ma_Sinh_Vien": "25525555",
    "Ho_Ten": "Trần Văn A",
    "Gioi_Tinh": "Nam",
    "Ngay_Sinh": "16-04-2002",
    "Noi_Sinh": "02",
    "Tinh_Trang": "Cảnh báo",
    "Lop": "MMTT0001",
    "Khoa": "Mạng máy tính & Truyền thông",
    "He_Dao_Tao": "Chất lượng cao",
    "Email_Truong": "25525555@gm.uit.edu.vn",
    "Email_Ca_Nhan": "b@gmail.com",
    "Dien_Thoai": "0999186536",
    "So_CMND": "099222000006",
    "Ngay_Cap_CMND": "20-07-2014",
    "Noi_Cap_CMND": "Cục cảnh sát ĐKQL cư trú và DLQG về dân cư",
    "Dan_Toc": "Kinh",
    "Ton_Giao": "Không",
    "Xuat_Than": "Cán bộ - Công chức",
    "Ngay_Vao_Doan": "26-03-2023",
    "Ngay_Vao_Dang": "",
    "Ho_Ten_Cha": "Trần Quang N",
    "Nghe_Nghiep_Cha": "Ủy viên ban chấp hành Đảng Bộ, Trưởng Chi nhánh Truyền Thông;  Kỹ sư, Cử nhân CNTT, Chuyên viên chính",
    "SDT_Cha": "0911464181",
    "Ho_Ten_Me": "Phan Thị K",
    "Nghe_Nghiep_Me": "Bác sĩ bệnh viện quận Rạch Chiếc",
    "SDT_Me": "0988288806",
    "Ho_Ten_Bao_Ho": "",
    "Thuong_Tru": "số nhà 99 đường số 9",
    "Quan_Huyen": "17",
    "Phuong_Xa": "26812",
    "Tinh_Tp": "01",
    "Dia_Chi_Tam_Tru": "Ký túc xá đại học quốc gia thành phố Hồ Chí Minh, Số 6, Phường Linh Trung, Quận Thủ Đức, Thành phố Hồ Chí Minh",
    "Dia_Chi_Cha": "32/17 đường số 993 thành phố Hồ Chí Minh",
    "Dia_Chi_Me": "32/17 đường số 993, thành phố Hồ Chí Minh",
    "Dia_Chi_Bao_Ho": "",
}
# Chuyển đổi định dạng ngày tháng từ DD-MM-YYYY sang YYYY-MM-DD
def convert_date(date_str):
    if date_str:  # Kiểm tra nếu có giá trị
        try:
            return datetime.strptime(date_str, "%d-%m-%Y").strftime("%Y-%m-%d")
        except ValueError:
            return None  # Nếu không đúng định dạng, trả về None
    return None  # Nếu giá trị rỗng, trả về None

# Chuyển đổi các giá trị ngày tháng
student_data["Ngay_Sinh"] = convert_date(student_data["Ngay_Sinh"])
student_data["Ngay_Cap_CMND"] = convert_date(student_data["Ngay_Cap_CMND"])
student_data["Ngay_Vao_Doan"] = convert_date(student_data["Ngay_Vao_Doan"])
student_data["Ngay_Vao_Dang"] = convert_date(student_data["Ngay_Vao_Dang"])

# Câu lệnh INSERT đã sửa để đồng nhất tên cột
sql = """
INSERT INTO students (Ma_Sinh_Vien, Ho_Ten, Gioi_Tinh, Ngay_Sinh, Noi_Sinh, Tinh_Trang, Lop, Khoa, He_Dao_Tao, 
                      Email_Truong, Email_Ca_Nhan, Dien_Thoai, So_CMND, Ngay_Cap_CMND, Noi_Cap_CMND, 
                      Dan_Toc, Ton_Giao, Xuat_Than, Ngay_Vao_Doan, Ngay_Vao_Dang, 
                      Ho_Ten_Cha, Nghe_Nghiep_Cha, SDT_Cha, Ho_Ten_Me, Nghe_Nghiep_Me, SDT_Me, Ho_Ten_Bao_Ho, Thuong_Tru, Quan_Huyen, 
                      Phuong_Xa, Tinh_Tp, Dia_Chi_Tam_Tru,
                      Dia_Chi_Cha, Dia_Chi_Me, Dia_Chi_Bao_Ho)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

# Chỉ lấy giá trị từ student_data dựa trên danh sách cột cần thiết
keys = ["Ma_Sinh_Vien", "Ho_Ten", "Gioi_Tinh", "Ngay_Sinh", "Noi_Sinh", "Tinh_Trang", "Lop", "Khoa", "He_Dao_Tao", 
        "Email_Truong", "Email_Ca_Nhan", "Dien_Thoai", "So_CMND", "Ngay_Cap_CMND", "Noi_Cap_CMND", 
        "Dan_Toc", "Ton_Giao", "Xuat_Than", "Ngay_Vao_Doan", "Ngay_Vao_Dang", "Ho_Ten_Cha","Nghe_Nghiep_Cha", 
        "SDT_Cha", "Ho_Ten_Me", "Nghe_Nghiep_Me", "SDT_Me", "Ho_Ten_Bao_Ho",
        "Thuong_Tru", "Quan_Huyen", "Phuong_Xa", "Tinh_Tp", 
        "Dia_Chi_Tam_Tru","Dia_Chi_Cha", "Dia_Chi_Me", "Dia_Chi_Bao_Ho"]

values = tuple(student_data[key] for key in keys)

# Thực thi câu lệnh SQL
cursor.execute(sql, values)
conn.commit()

print("✅ Dữ liệu đã được lưu vào MySQL thành công!")

cursor.close()
conn.close()
