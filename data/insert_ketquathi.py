import mysql.connector
import random

gate = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0919472035Az",
    database="chatbot_uit"
)
cursor = gate.cursor()

# Lấy mssv 
cursor.execute("SELECT Ma_Sinh_Vien FROM SINHVIEN")
mssv_list = (row[0] for row in cursor.fetchall()) # fetchall: lấy tất cả dữ liệu

# Lấy mã môn
cursor.execute("SELECT Ma_Mon_Hoc FROM SINHVIEN")
monhoc_list = (row[0] for row in cursor.fetchall()) # fetchall: lấy tất cả dữ liệu

# close
cursor.close()
gate.close()

# openfile and write

with open("insert_ketquathi.sql", 'w', encoding='utf-8') as f:
    for mssv
        for monhoc

