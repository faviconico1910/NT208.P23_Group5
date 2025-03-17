import re
import random
import hashlib

# === Cấu hình các file ===
file_sinhvien = "insert_sinhvien.sql"
file_giangvien = "insert_giangvien.sql"
file_users = "insert_users.sql"

# === Hàm băm mật khẩu SHA-256 ===
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# === Đọc danh sách sinh viên từ file SQL ===
sinhvien_list = []
with open(file_sinhvien, "r", encoding="utf-8") as f:
    content = f.read()
    matches = re.findall(r"\((.*?)\)", content)  # Tìm tất cả giá trị trong ngoặc đơn

    for match in matches:
        fields = re.split(r",\s*", match)  # Tách theo dấu phẩy và bỏ khoảng trắng
        if len(fields) > 0:
            mssv = fields[0].strip().strip("'")  # MSSV
            if mssv.startswith("SV"):  # Chỉ lấy những mã hợp lệ
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
data_users = []

# Thêm Sinh viên
for mssv in sinhvien_list:
    password = hash_password(mssv)
    record = f"('{mssv}', '{password}', 'SinhVien')"
    data_users.append(record)

# Thêm Giảng viên (chỉ có vai trò GiangVien)
for ma_gv in giangvien_list:
    password = hash_password(ma_gv)
    record = f"('{ma_gv}', '{password}', 'GiangVien')"
    data_users.append(record)

# === Ghi dữ liệu vào file SQL ===
with open(file_users, "w", encoding="utf-8") as f:
    f.write("INSERT INTO USERS (username, password, role) VALUES\n")
    for i, record in enumerate(data_users):
        f.write(f"{record}")
        if i < len(data_users) - 1:
            f.write(",\n")
        else:
            f.write(";\n")

print(f"File SQL đã được tạo: {file_users}")
