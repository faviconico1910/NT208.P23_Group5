from faker import Faker
import random

def generate_ma_sv(nam_nhap_hoc, stt):
    nam_nhap_hoc_str = str(nam_nhap_hoc % 2000)  # Chuyển năm nhập học thành 2 chữ số cuối
    ma_nganh_mac_dinh = "52"  # Hai số tiếp theo mặc định là 52
    so_thu_tu = f"{stt:04d}"  # Số thứ tự có 4 chữ số
    return f"{nam_nhap_hoc_str}{ma_nganh_mac_dinh}{so_thu_tu}"

def main():
    faker = Faker("vi_VN")  # Ngôn ngữ tiếng Việt

    # Danh sách dữ liệu mẫu
    ds_khoa = ["MMT&TT"]
    ds_nganh = {
        "MMT&TT": ["ATTT", "MMT"],
    }
    ds_tinh_trang = ["Đang học", "Cảnh báo", "Bảo lưu", "Tốt nghiệp"]
    ds_he_dao_tao = ["Chính quy", "Chất lượng cao"]
    ds_dan_toc = ["Kinh", "Tày", "Nùng", "Khmer"]
    ds_ton_giao = ["Không", "Phật giáo", "Thiên Chúa", "Hòa Hảo"]
    ds_xuat_than = ["Cán bộ - Công chức", "Nông dân", "Công nhân", "Viên chức"]
    noi_cap_cmnd = "Cục cảnh sát ĐKQL cư trú và DLQG về dân cư"

    sinh_vien_per_year = 250
    years = [2024, 2023, 2022, 2021]

    existing_ids = set()  # Lưu danh sách mã sinh viên đã tạo để tránh trùng lặp

    # Mở file để ghi SQL
    with open("insert_sinhvien.sql", "w", encoding="utf-8") as file:
        file.write("INSERT INTO SINHVIEN (Ma_Sinh_Vien, Ho_Ten, Gioi_Tinh, Ngay_Sinh, Noi_Sinh, Tinh_Trang, Nam_Nhap_Hoc,Ma_Lop, Ma_Khoa, Ma_Nganh, He_Dao_Tao, Email_Truong, Email_Ca_Nhan, Dien_Thoai, So_CMND, Ngay_Cap_CMND, Noi_Cap_CMND, Dan_Toc, Ton_Giao, Xuat_Than, Ngay_Vao_Doan, Ngay_Vao_Dang, Ho_Ten_Cha, Nghe_Nghiep_Cha, SDT_Cha, Ho_Ten_Me, Nghe_Nghiep_Me, SDT_Me, Ho_Ten_Bao_Ho, Thuong_Tru, Quan_Huyen, Phuong_Xa, Tinh_Tp, Dia_Chi_Tam_Tru, Dia_Chi_Cha, Dia_Chi_Me, Dia_Chi_Bao_Ho) VALUES\n")
        
        values = []
        for year in years:
            for stt in range(1, sinh_vien_per_year + 1):
                ma_sv = generate_ma_sv(year, stt)
                ho_ten = faker.name()
                gioi_tinh = random.choice(["Nam", "Nữ"])
                noi_sinh = f"{random.randint(1, 99)}"
                tinh_trang = random.choice(ds_tinh_trang)
                ma_khoa = random.choice(ds_khoa)
                ma_nganh = random.choice(ds_nganh[ma_khoa])
                nam_nhap_hoc = year
                nam_sinh = nam_nhap_hoc - 18
                ngay_sinh = faker.date_of_birth(minimum_age=18, maximum_age=18, tzinfo=None).replace(year=nam_sinh).strftime("%Y-%m-%d")
                lop = random.randint(1, 2)
                ma_lop = f"{ma_nganh}{nam_nhap_hoc}.{lop}"
                he_dao_tao = random.choice(ds_he_dao_tao)
                email_truong = f"{ma_sv}@gm.uit.edu.vn"
                email_ca_nhan = faker.email()
                dien_thoai = faker.phone_number()
                so_cmnd = f"{random.randint(100000000000, 999999999999)}"
                ngay_cap_cmnd = faker.date_between(start_date="-10y", end_date="today").strftime("%Y-%m-%d")
                dan_toc = random.choice(ds_dan_toc)
                ton_giao = random.choice(ds_ton_giao)
                xuat_than = random.choice(ds_xuat_than)
                ngay_vao_doan = "NULL" if random.random() > 0.5 else f"'{faker.date_between(start_date='-8y', end_date='-4y')}'"
                ngay_vao_dang = "NULL" if random.random() > 0.8 else f"'{faker.date_between(start_date='-5y', end_date='today')}'"
                ho_ten_cha = faker.name_male()
                nghe_nghiep_cha = faker.job()
                sdt_cha = faker.phone_number()
                ho_ten_me = faker.name_female()
                nghe_nghiep_me = faker.job()
                sdt_me = faker.phone_number()
                ho_ten_bao_ho = faker.name() if random.random() > 0.3 else ""
                thuong_tru = faker.address().replace("\n", " ")
                quan_huyen = f"{random.randint(1, 99)}"
                phuong_xa = f"{random.randint(10000, 99999)}"
                tinh_tp = f"{random.randint(1, 99)}"
                dia_chi_tam_tru = faker.address().replace("\n", " ")
                dia_chi_cha = faker.address().replace("\n", " ")
                dia_chi_me = faker.address().replace("\n", " ")
                dia_chi_bao_ho = faker.address().replace("\n", " ") if ho_ten_bao_ho else ""

                values.append(f"('{ma_sv}', '{ho_ten}', '{gioi_tinh}', '{ngay_sinh}', '{noi_sinh}', '{tinh_trang}','{nam_nhap_hoc}', '{ma_lop}', '{ma_khoa}', '{ma_nganh}', '{he_dao_tao}', '{email_truong}', '{email_ca_nhan}', '{dien_thoai}', '{so_cmnd}', '{ngay_cap_cmnd}', '{noi_cap_cmnd}', '{dan_toc}', '{ton_giao}', '{xuat_than}', {ngay_vao_doan}, {ngay_vao_dang}, '{ho_ten_cha}', '{nghe_nghiep_cha}', '{sdt_cha}', '{ho_ten_me}', '{nghe_nghiep_me}', '{sdt_me}', '{ho_ten_bao_ho}', '{thuong_tru}', '{quan_huyen}', '{phuong_xa}', '{tinh_tp}', '{dia_chi_tam_tru}', '{dia_chi_cha}', '{dia_chi_me}', '{dia_chi_bao_ho}')")
        
        file.write(",\n".join(values) + ";\n")

if __name__ == "__main__":
    main()
