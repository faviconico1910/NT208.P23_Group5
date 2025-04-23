import re

# Bước 1: Trích xuất tất cả mã lớp học từ lichhoc
def get_all_lichhoc_classes(lichhoc_file):
    with open(lichhoc_file, 'r', encoding='utf-8') as f:
        content = f.read()
    # Trích xuất tất cả mã lớp: phần tử đầu tiên trong mỗi dòng insert
    return re.findall(r"\(\s*'([^']+)'", content)

# Bước 2: Thay thế mã lớp học trong file đăng ký
def update_dangky_with_correct_classes(dangky_file, output_file, all_class_codes):
    with open(dangky_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    updated_lines = []

    for line in lines:
        match = re.match(r'\s*\("(\d+)",\s*"([A-Z]+\d+)",\s*"([^"]+)"', line)
        if match:
            mssv, ma_mon, ma_lop = match.groups()

            # Tìm danh sách lớp học phù hợp (bắt đầu bằng mã môn học)
            suitable_classes = [lop for lop in all_class_codes if lop.startswith(ma_mon)]

            if suitable_classes:
                new_lop = suitable_classes[0]  # Lấy lớp đầu tiên tìm thấy
                line = line.replace(ma_lop, new_lop)

        updated_lines.append(line)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(updated_lines)

    print(f"✅ Đã cập nhật và lưu vào: {output_file}")

# ---- Thực thi ----
lichhoc_path = "database/sql/insert_lichhoc.sql"
dangky_path = "database/sql/insert_dangky.sql"
output_path = "database/sql/insert_dangky_fixed.sql"

all_class_codes = get_all_lichhoc_classes(lichhoc_path)
update_dangky_with_correct_classes(dangky_path, output_path, all_class_codes)
