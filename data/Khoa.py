import random

ds_khoa = ["KH&KTTT", "MMT&TT", "KHMT", "KTMT", "CNPM", "HTTT"]
ds_ten_khoa = [
    "Khoa học và kĩ thuật thông tin",
    "Mạng máy tính và truyền thông",
    "Khoa học máy tính",
    "Kĩ thuật máy tính",
    "Công nghệ phần mềm",
    "Hệ thống thông tin"
]

def generate_ma_truong_khoa():
    return f"GV{random.randint(1, 9999)}"

with open("insert_khoa.sql", "w", encoding="utf-8") as file:
    for ma_khoa, ten_khoa in zip(ds_khoa, ds_ten_khoa):
        ma_truong_khoa = generate_ma_truong_khoa()
        sql = f"""
        INSERT INTO KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)
        VALUES ('{ma_khoa}', '{ten_khoa}', '{ma_truong_khoa}');
        """
        file.write(sql)
