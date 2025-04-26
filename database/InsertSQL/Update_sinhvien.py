import re
import random

def fix_sinhvien_add_cert(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Tìm header INSERT INTO SINHVIEN (...) VALUES
    header_match = re.search(r'(INSERT INTO SINHVIEN\s*\([^)]+?\))(\s*VALUES\s*)', content, re.IGNORECASE)
    if not header_match:
        print("Không tìm thấy header INSERT INTO SINHVIEN.")
        return

    header = header_match.group(1)
    values_keyword = header_match.group(2)

    # Thêm 2 cột vào header
    new_header = header[:-1] + ", Chung_Chi_Anh_Van, Chung_Chi_Quan_Su)"

    # Lấy phần values phía sau
    values_part = content[header_match.end():].strip()

    # Tách từng dòng VALUES theo '),'
    value_lines = re.split(r'\),\s*\n?', values_part)
    if value_lines[-1].endswith(';'):
        value_lines[-1] = value_lines[-1][:-1]  # Bỏ dấu ; ở dòng cuối nếu có

    # Danh sách giá trị random
    anh_van_list = ['Có', 'Chưa có']
    quan_su_list = ['Có', 'Chưa có']

    fixed_values = []
    for value in value_lines:
        value = value.strip()
        if value:
            if not value.endswith(')'):
                value = value + ')'
            # Thêm 2 giá trị random
            ccav = random.choice(anh_van_list)
            ccqs = random.choice(quan_su_list)
            new_value = value[:-1] + f", '{ccav}', '{ccqs}')"
            fixed_values.append(new_value)

    # Ghép lại nội dung mới
    new_content = new_header + values_keyword + '\n' + ',\n'.join(fixed_values) + ';\n'

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✅ Đã thêm 2 chứng chỉ vào SINHVIEN và lưu tại: {output_path}")

# Đường dẫn file
input_path = 'database/sql/insert_sinhvien.sql'
output_path = 'database/sql/insert_sinhvien_with_cert.sql'

# Thực thi sửa file
fix_sinhvien_add_cert(input_path, output_path)
