from faker import Faker
import random
import unidecode

fake = Faker("vi_VN")

dia_phuong = {
    "Hà Nội": {
        "Ba Đình": ["Phường Điện Biên", "Phường Ngọc Hà"],
        "Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Gai"],
        "Cầu Giấy": ["Phường Dịch Vọng", "Phường Nghĩa Tân"],
    },
    "TP Hồ Chí Minh": {
        "Quận 1": ["Phường Bến Nghé", "Phường Nguyễn Cư Trinh"],
        "Quận 3": ["Phường Võ Thị Sáu", "Phường 7"],
        "Bình Thạnh": ["Phường 1", "Phường 24"],
    },
    "Đà Nẵng": {
        "Hải Châu": ["Phường Hải Châu 1", "Phường Thanh Bình"],
        "Thanh Khê": ["Phường Tân Chính", "Phường Chính Gián"],
    },
}

duong_list = [
    "Nguyễn Huệ", "Lý Thường Kiệt", "Trần Hưng Đạo",
    "Phan Chu Trinh", "Điện Biên Phủ", "Hai Bà Trưng",
    "Lê Lợi", "Hoàng Diệu", "Quang Trung"
]

ma_khoa_list = {
    # "KH&KTTT": "Khoa Khoa học và Kỹ thuật Thông tin",
    # "CNPM": "Khoa Công nghệ Phần mềm",
    # "HTTT": "Khoa Hệ thống Thông tin",
    # "KTMT": "Khoa Kỹ thuật Máy tính",
    "MMT&TT": "Khoa Mạng Máy tính và Truyền thông"
    #"KHMT": "Khoa Khoa học Máy tính",
}

dau_so = ["032", "033", "034", "035", "036", "037", "038", "039",
          "070", "076", "077", "078", "079",
          "081", "082", "083", "084", "085", "086",
          "056", "058", "059"]

def tao_so_dien_thoai():
    return random.choice(dau_so) + str(random.randint(1000000, 9999999))

def tao_email(ho_ten):
    return unidecode.unidecode(ho_ten).lower().replace(" ", "") + "@gm.uit.edu.vn"

def tao_dia_chi():
    tinh_tp = random.choice(list(dia_phuong.keys()))
    quan_huyen = random.choice(list(dia_phuong[tinh_tp].keys()))
    phuong_xa = random.choice(dia_phuong[tinh_tp][quan_huyen])
    so_nha = random.randint(1, 999)
    ten_duong = random.choice(duong_list)
    return f"{so_nha} {ten_duong}, {phuong_xa}, {quan_huyen}, {tinh_tp}", quan_huyen, phuong_xa, tinh_tp

def generate_fake_data(num_records=100):
    data = []
    for i in range(1, num_records + 1):
        ma_giang_vien = f"GV{i:03d}"
        dia_chi_tt, quan_huyen_tt, phuong_xa_tt, tinh_tp_tt = tao_dia_chi()
        dia_chi_ttam, quan_huyen_ttam, phuong_xa_ttam, tinh_tp_ttam = tao_dia_chi()
        ma_khoa = random.choice(list(ma_khoa_list.keys()))

        ho_ten = fake.name()
        email_truong = tao_email(ho_ten)

        record = (
            f"'{ma_giang_vien}'",
            f"'{ho_ten}'",
            f"'{random.choice(['Nam', 'Nữ'])}'",
            f"'{fake.date_of_birth(minimum_age=25, maximum_age=65).strftime('%Y-%m-%d')}'",
            f"'{tinh_tp_tt}'",
            f"'{ma_khoa}'",
            f"'{email_truong}'",
            f"'{ho_ten.lower().replace(' ', '')}@gmail.com'",
            f"'{fake.user_name()}'",
            f"'{tao_so_dien_thoai()}'",
            f"'{random.randint(100000000000, 999999999999)}'",
            f"'{fake.date_between(start_date='-20y', end_date='today').strftime('%Y-%m-%d')}'",
            f"'{tinh_tp_tt}'",
            f"'{random.choice(['Kinh', 'Tày', 'Thái', 'Mường'])}'",
            f"'{random.choice(['Không', 'Phật giáo', 'Thiên chúa giáo'])}'",
            f"'{random.choice(['Nông thôn', 'Thành thị'])}'",
            f"'{fake.date_between(start_date='-30y', end_date='today').strftime('%Y-%m-%d')}'",
            f"'{fake.date_between(start_date='-20y', end_date='today').strftime('%Y-%m-%d')}'",
            f"'{fake.name()}'",
            f"'{fake.job()}'",
            f"'{tao_so_dien_thoai()}'",
            f"'{fake.name()}'",
            f"'{fake.job()}'",
            f"'{tao_so_dien_thoai()}'",
            f"'{dia_chi_tt}'",
            f"'{quan_huyen_tt}'",
            f"'{phuong_xa_tt}'",
            f"'{tinh_tp_tt}'",
            f"'{dia_chi_ttam}'",
            f"'{random.choice(['ThS', 'TS', 'PGS', 'GS'])}'",
            f"'{random.choice(['Không', 'Phó Giáo sư', 'Giáo sư'])}'",
            f"{round(random.uniform(2.34, 6.78), 2)}",
            f"{random.randint(7000000, 30000000)}"
        )
        data.append(record)
    
    return data

num_records = 100
fake_data = generate_fake_data(num_records)

file_path = "insert_giangvien.sql"
with open(file_path, "w", encoding="utf-8") as f:
    f.write("INSERT INTO GIANGVIEN (...) VALUES\n")
    for i, record in enumerate(fake_data):
        f.write(f"({', '.join(record)})")
        if i < len(fake_data) - 1:
            f.write(",\n")
        else:
            f.write(";\n")

print(f"File SQL đã được tạo: {file_path}")
