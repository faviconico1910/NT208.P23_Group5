years = range(2021, 2025)  # Từ khóa 2019 đến 2024
majors = {
    "ATTT": "An toàn Thông tin",
    # "CNTT": "Công nghệ Thông tin",
    # "KHMT": "Khoa học Máy tính",
    # "KTMT": "Kỹ thuật Máy tính",
    # "HTTT": "Hệ thống Thông tin",
    "MMT": "Mạng Máy tính"
    # "TMDT": "Thương mại Điện tử",
    # "KHDL": "Khoa học Dữ liệu",
    # "TTNT": "Trí tuệ Nhân tạo",
    # "TKVM": "Thiết kế Vi mạch",
    # "KTPM": "Kỹ thuật Phần mềm"
}

def generate_sql():
    with open("insert_lop.sql", "w", encoding="utf-8") as f:
        f.write("INSERT INTO LOP (Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap) VALUES\n")
        values = []
        gv_counter = 1  # Đếm giáo viên
        
        for year in years:
            for major_code, major_name in majors.items():
                for i in range(1, 3):  # Mỗi ngành có 2 lớp
                    class_code = f"{major_code}{year}.{i}"
                    class_name = f"Lớp {major_name} {i} - Khóa {year}"
                    teacher_code = f"GV{str(gv_counter).zfill(3)}"
                    values.append(f"('{class_code}', '{class_name}', 50, '{teacher_code}')")
                    gv_counter += 1
        
        f.write(",\n".join(values) + ";\n")

# Gọi hàm để tạo file SQL
generate_sql()
print("File insert_lop.sql đã được tạo thành công!")
