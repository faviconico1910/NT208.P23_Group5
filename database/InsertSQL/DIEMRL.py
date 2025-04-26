import random

# Hàm tạo câu lệnh INSERT cho bảng DIEMRL
def generate_diemrl_data():
    sql_statements = []

    # 2152xxxx: 8 học kỳ
    for msv in range(21520001, 21520251):
        for hk in range(1, 9):
            diem = random.randint(40, 100)
            sql_statements.append(f"INSERT INTO DIEMRL (Ma_Sinh_Vien, Hoc_Ki, Diem_Ren_Luyen) VALUES ('{msv}', {hk}, {diem});")

    # 2252xxxx: 6 học kỳ
    for msv in range(22520001, 22520251):
        for hk in range(1, 7):
            diem = random.randint(40, 100)
            sql_statements.append(f"INSERT INTO DIEMRL (Ma_Sinh_Vien, Hoc_Ki, Diem_Ren_Luyen) VALUES ('{msv}', {hk}, {diem});")

    # 2352xxxx: 4 học kỳ
    for msv in range(23520001, 23520251):
        for hk in range(1, 5):
            diem = random.randint(40, 100)
            sql_statements.append(f"INSERT INTO DIEMRL (Ma_Sinh_Vien, Hoc_Ki, Diem_Ren_Luyen) VALUES ('{msv}', {hk}, {diem});")

    # 2452xxxx: 2 học kỳ
    for msv in range(24520001, 24520251):
        for hk in range(1, 3):
            diem = random.randint(40, 100)
            sql_statements.append(f"INSERT INTO DIEMRL (Ma_Sinh_Vien, Hoc_Ki, Diem_Ren_Luyen) VALUES ('{msv}', {hk}, {diem});")

    return "\n".join(sql_statements)

# Sinh dữ liệu
data_sql = generate_diemrl_data()
# Lưu vào file
file_path = "database/sql/insert_diemrl.sql"
with open(file_path, "w") as file:
    file.write(data_sql)

file_path
