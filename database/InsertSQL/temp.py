import re
import random

def load_monhoc_hocky(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    monhoc_data = re.findall(r"\(\s*'[^']+',\s*'[^']+',\s*'([^']+)',\s*'[^']+',\s*(\d+)", content)
    return {mon: int(hk) for mon, hk in monhoc_data}

def fix_hocky_in_dangky(dangky_path, monhoc_hocky_map, output_path):
    with open(dangky_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'\(([^)]+)\)'
    values = re.findall(pattern, content)

    fixed_values = []
    for value in values:
        parts = [p.strip() for p in value.split(',')]
        if len(parts) >= 5:
            ma_mon_hoc = parts[1].strip('"')
            if ma_mon_hoc in monhoc_hocky_map:
                hoc_ky_moi = monhoc_hocky_map[ma_mon_hoc]
            else:
                if ma_mon_hoc.startswith('ENG'):
                    hoc_ky_moi = 6
                else:
                    hoc_ky_moi = random.choice([7, 8])
            parts[4] = str(hoc_ky_moi)
            fixed_values.append(', '.join(parts))
        else:
            print(f"⚠️ Dòng không hợp lệ (ít hơn 5 cột): ({value})")

    insert_header = 'INSERT INTO DANGKY (Ma_Sinh_Vien, Ma_Mon_Hoc, Ma_Lop_Hoc, Loai, Hoc_Ki) VALUES\n'
    new_content = insert_header + ',\n'.join(f"({v})" for v in fixed_values) + ';\n'

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✅ Đã cập nhật học kỳ theo insert_monhoc.sql + ENG=6 + random 7|8 cho môn khác, lưu tại: {output_path}")

# Đường dẫn file
monhoc_path = 'database/sql/insert_monhoc.sql'
dangky_path = 'database/sql/insert_dangky.sql'
output_path = 'database/sql/insert_dangky_fixed.sql'

# Load map Ma_Mon_Hoc -> Hoc_Ki
monhoc_hocky_map = load_monhoc_hocky(monhoc_path)

# Sửa file đăng ký
fix_hocky_in_dangky(dangky_path, monhoc_hocky_map, output_path)
