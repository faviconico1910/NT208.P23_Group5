import re

def extract_class_codes_from_lichhoc(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Match chuỗi đầu tiên trong mỗi tuple, ví dụ: ('NT207.P21.ANTT', ...)
    return set(re.findall(r"\(\s*'([^']+)'", content))

def extract_class_codes_from_dangky(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Match mã lớp là phần tử thứ 3 trong chuỗi: ("mssv", "masv", "malop", ...)
    return set(re.findall(r'\(\s*"\d+",\s*"[A-Z]+\d+",\s*"([^"]+)"', content))

# Đường dẫn
lichhoc_classes = extract_class_codes_from_lichhoc("database/sql/insert_lichhoc.sql")
dangky_classes = extract_class_codes_from_dangky("database/sql/insert_dangky_fixed.sql")

invalid_classes = dangky_classes - lichhoc_classes



if invalid_classes:
    print("⚠️ Các mã lớp có trong file đăng ký nhưng không có trong lịch học:")
    for cls in sorted(invalid_classes):
        print(f" - {cls}")
else:
    print("✅ Tất cả các lớp trong đăng ký đều có trong lịch học.")

# In kết quả
print(f"✅ Số lớp trong lịch học: {len(lichhoc_classes)}")
print(f"✅ Số lớp trong đăng ký: {len(dangky_classes)}")
print(f"⚠️ Số lớp không tìm thấy trong lịch học: {len(invalid_classes)}\n")