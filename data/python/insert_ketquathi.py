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

# Lấy mssv, năm nhập học
cursor.execute("SELECT Ma_Sinh_Vien, Nam_Nhap_Hoc FROM SINHVIEN")
sv_list = cursor.fetchall() # fetchall: lấy tất cả dữ liệu

# Lấy mã môn, học kì, tín chỉ thực hành
cursor.execute("SELECT Ma_Mon_Hoc, Hoc_Ki, Tin_chi_TH  FROM MONHOC")
monhoc_list = cursor.fetchall() # fetchall: lấy tất cả dữ liệu

# test 
# for sv, nnh in sv_list:
#     print(sv, tk)

# openfile and write


with open("insert_ketquathi.sql", 'w', encoding='utf-8') as f:
    f.write("INSERT INTO KETQUA (Ma_Sinh_Vien, Hoc_Ky, Ma_Mon_Hoc, Diem_QT, Diem_GK, Diem_TH, Diem_CK, Diem_HP, GHI_CHU) VALUES\n")
    for sv, nnh in sv_list: # năm nhập học
        nam_hoc = datetime.now().year - nnh
        if nam_hoc == 0:
            nam_hoc = 1

        # danh sách học kì sinh viên đó có thể học các môn tại các học kì đó
        max_hk = min(nam_hoc * 2, 8)  # max là 8

        
        ds_hoc_ky = list(range(1, max_hk + 1))


        # môn học phù hợp
        mh_phuhop =  [(mh, hk, tinchi_th) for mh, hk, tinchi_th in monhoc_list if hk <= max(ds_hoc_ky)]

        # map kết quả theo học kì
        ketqua = {hk: [] for hk in ds_hoc_ky}

        # bắt đầu gán môn học cho từng sinh viên theo từng học kì
        for mh, hocki, tinchi_th in mh_phuhop:
            ketqua[hocki].append((mh, tinchi_th))

        # viết theo thứ tự học kì của từng sinh viên
        for hk in ds_hoc_ky:
            if hk not in ketqua: # k có thì thôi
                continue

            for mh, tinchi_th in ketqua[hk]:
                diem_qt = round(random.uniform(0, 10), 2)
                diem_gk = round(random.uniform(0, 10), 2)
                if tinchi_th > 0:
                    diem_th = round(random.uniform(0, 10), 2)
                else:
                    diem_th = None
                diem_ck = round(random.uniform(0, 10), 2)
                if tinchi_th > 0:
                    diem_hp = round((diem_qt * 0.2 + diem_gk * 0.2 + diem_th * 0.2 + diem_ck * 0.4), 2)
                    sql = f"VALUES ('{sv}', {hk}, '{mh}', {diem_qt}, {diem_gk}, {diem_th}, {diem_ck}, {diem_hp}, '{'Học lại' if diem_hp < 5 else ''}'),\n"
                else:
                    diem_hp = round((diem_qt * 0.2 + diem_gk * 0.3 + diem_ck * 0.5), 2)
                    sql = f"VALUES ('{sv}', {hk}, '{mh}', {diem_qt}, {diem_gk}, NULL, {diem_ck}, {diem_hp}, '{'Học lại' if diem_hp < 5 else ''}'),\n"
                        
                f.write(sql)
                 
            
# close connection
cursor.close()
gate.close()