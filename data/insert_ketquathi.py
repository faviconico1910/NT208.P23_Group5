import mysql.connector
import random
from datetime import datetime

gate = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0919472035Az",
    database="chatbot_uit"
)
cursor = gate.cursor()

# Lấy mssv 
cursor.execute("SELECT Ma_Sinh_Vien, Nam_Nhap_Hoc FROM SINHVIEN")
sv_list = cursor.fetchall() # fetchall: lấy tất cả dữ liệu

# Lấy mã môn
cursor.execute("SELECT Ma_Mon_Hoc, Hoc_Ki, Tin_chi_TH  FROM MONHOC")
monhoc_list = cursor.fetchall() # fetchall: lấy tất cả dữ liệu

# test 
# for sv, nnh in sv_list:
#     print(sv, tk)

# openfile and write


with open("insert_ketquathi.sql", 'w', encoding='utf-8') as f:
    for sv, nnh in sv_list: # năm nhập học
        nam_hoc = datetime.now().year - nnh

        # danh sách học kì sinh viên đó có thể học các môn tại các học kì đó
        max_hk = min(nam_hoc * 2 + 1, 8)  # max là 8

        
        ds_hoc_ky = sorted(random.sample(range(1, max_hk + 1), max_hk))


        # môn học phù hợp
        mh_phuhop =  [(mh, hk, tinchi_th) for mh, hk, tinchi_th in monhoc_list if hk <= max(ds_hoc_ky)]



        # bắt đầu gán môn học cho từng sinh viên
        for mh, hocki, tinchi_th in mh_phuhop:
            hk = hocki
            diem_qt = round(random.uniform(0, 10), 2)
            diem_gk = round(random.uniform(0, 10), 2)
            if tinchi_th > 0:
                diem_th = round(random.uniform(0, 10), 2)
            else:
                diem_th = None
            diem_ck = round(random.uniform(0, 10), 2)
            if tinchi_th > 0:
                diem_hp = round((diem_qt * 0.2 + diem_gk * 0.2 + diem_th * 0.2 + diem_ck * 0.4), 2)
                sql = f"INSERT INTO KETQUA (Ma_Sinh_Vien, Hoc_Ky, Ma_Mon_Hoc, Diem_QT, Diem_GK, Diem_TH, Diem_CK, Diem_HP, GHI_CHU) " \
                      f"VALUES ('{sv}', {hk}, '{mh}', {diem_qt}, {diem_gk}, {diem_th}, {diem_ck}, {diem_hp}, '{'Học lại' if diem_hp < 5 else ''}');\n"
            else:
                diem_hp = round((diem_qt * 0.2 + diem_gk * 0.3 + diem_ck * 0.5), 2)
                sql = f"INSERT INTO KETQUA (Ma_Sinh_Vien, Hoc_Ky, Ma_Mon_Hoc, Diem_QT, Diem_GK, Diem_TH, Diem_CK, Diem_HP, GHI_CHU) " \
                      f"VALUES ('{sv}', {hk}, '{mh}', {diem_qt}, {diem_gk}, NULL, {diem_ck}, {diem_hp}, '{'Học lại' if diem_hp < 5 else ''}');\n"
            f.write(sql)
        
# close connection
cursor.close()
gate.close()