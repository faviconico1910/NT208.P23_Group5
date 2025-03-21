import re
import random
import string

# === Cấu hình các file ===
file_sinhvien = "insert_sinhvien.sql"
file_giangvien = "insert_giangvien.sql"
file_user = "insert_user.sql"

# === Hàm tạo mật khẩu ngẫu nhiên (10 ký tự) ===
def generate_password(length=10):
    characters = string.ascii_letters + string.digits  # Chữ hoa, chữ thường, số
    return ''.join(random.choice(characters) for _ in range(length))

# === Đọc danh sách sinh viên từ file SQL ===
sinhvien_list = []

with open(file_sinhvien, "r", encoding="utf-8") as f:
    content = f.read()
    # Tìm tất cả các dòng chứa thông tin sinh viên
    matches = re.findall(r"\(([^)]+)\)", content)

    for match in matches:
        # Tách các trường dữ liệu
        fields = [field.strip().strip("'") for field in match.split(",")]
        if len(fields) > 0:
            mssv = fields[0]  # Lấy MSSV là cột đầu tiên
            if mssv.isdigit() and len(mssv) == 8:  # Kiểm tra nếu MSSV là số hợp lệ (8 chữ số)
                sinhvien_list.append(mssv)

# === Đọc danh sách giảng viên từ file SQL ===
giangvien_list = []  # Danh sách tất cả giảng viên

with open(file_giangvien, "r", encoding="utf-8") as f:
    content = f.read()
    matches = re.findall(r"\((.*?)\)", content)  # Lấy dữ liệu từ SQL

    for match in matches:
        fields = re.split(r",\s*", match)  # Tách dữ liệu đúng cách
        if len(fields) >= 6:
            ma_gv = fields[0].strip().strip("'")  # Mã giảng viên (cột 1)
            if ma_gv.startswith("GV"):  # Chỉ lấy giảng viên hợp lệ
                giangvien_list.append(ma_gv)

# === Tạo danh sách USERS ===
data_user = []

# Thêm Sinh viên
for mssv in sinhvien_list:
    password = generate_password()
    record = f"('{mssv}', '{password}', 'SinhVien')"
    data_user.append(record)

# Thêm Giảng viên (chỉ có vai trò GiangVien)
for ma_gv in giangvien_list:
    password = generate_password()
    record = f"('{ma_gv}', '{password}', 'GiangVien')"
    data_user.append(record)

# === Ghi dữ liệu vào file SQL ===
with open(file_user, "w", encoding="utf-8") as f:
    f.write("INSERT INTO USER (Tai_Khoan, Mat_Khau, Vai_Tro) VALUES\n")
    for i, record in enumerate(data_user):
        f.write(f"{record}")
        if i < len(data_user) - 1:
            f.write(",\n")
        else:
            f.write(";\n")

print(f"File SQL đã được tạo: {file_user}")