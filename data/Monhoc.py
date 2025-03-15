from bs4 import BeautifulSoup

data_html = """
    
"""

# Danh sách các khoa cần lấy
danh_sach_khoa = ["KH&KTTT", "MMT&TT", "KHMT", "KTMT", "CNPM", "HTTT"]

soup = BeautifulSoup(data_html, "html.parser")
rows = soup.find_all("tr")

insert_statements = []

for row in rows:
    cols = row.find_all("td")
    if len(cols) < 13:
        continue  # Đảm bảo có đủ cột dữ liệu

    ma_mon_hoc = cols[1].text.strip()
    ten_mon_hoc = cols[2].text.strip()
    ma_khoa = cols[5].text.strip()
    loai_mh = cols[6].text.strip()
    # Chỉ lấy các môn thuộc các khoa cần thiết
    if ma_khoa not in danh_sach_khoa:
        continue  

    tin_chi_lt = cols[11].text.strip()
    tin_chi_th = cols[12].text.strip()
    
    # Lấy đúng cột mã môn học tiên quyết
    ma_mon_hoc_tien_quyet = cols[9].text.strip()
    ma_mon_hoc_tien_quyet = f"'{ma_mon_hoc_tien_quyet}'" if ma_mon_hoc_tien_quyet else "NULL"

    sql = f"""
    INSERT INTO MONHOC (Ma_Mon_Hoc, Ten_Mon_Hoc, Loai_MH, Ma_Khoa, Tin_chi_LT, Tin_chi_TH, Ma_Mon_Hoc_Tien_Quyet)
    VALUES ('{ma_mon_hoc}', '{ten_mon_hoc}', '{loai_mh}', '{ma_khoa}', {tin_chi_lt}, {tin_chi_th}, {ma_mon_hoc_tien_quyet});
    """
    insert_statements.append(sql.strip())

# Xuất ra file SQL
with open("insert_monhoc.sql", "w", encoding="utf-8") as file:
    file.write("\n".join(insert_statements))

print("Tạo file SQL thành công!")
