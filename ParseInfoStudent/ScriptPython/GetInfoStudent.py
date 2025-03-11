import json
from bs4 import BeautifulSoup

# Đọc file HTML 
with open("XemthongtinSv.html", "r", encoding="utf-8") as file:
    html_content = file.read()

# Phân tích HTML bằng BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

def get_input_value(name):
    element = soup.find("input", {"name": name})
    return element["value"] if element and "value" in element.attrs else "Không có dữ liệu"

def get_select_value(name):
    element = soup.find("select", {"name": name})
    if element:
        selected_option = element.find("option", selected=True)
        return selected_option.text.strip() if selected_option else "Không có dữ liệu"
    return "Không có dữ liệu"

# Lấy thông tin từ trang
student_info = {
    "Ma_Sinh_Vien": get_input_value("txtmssv"),
    "Ho_Ten": get_input_value("txtten"),
    "Gioi_Tinh": get_select_value("ddlphai"),
    "Ngay_Sinh": get_input_value("dngaysinh"),
    "Noi_Sinh": get_input_value("txtnoisinh"),
    "Tinh_Trang": get_select_value("ddltinhtrang"),
    "Lop": get_input_value("txtlopsh"),
    "Khoa": get_select_value("ddlkhoa"),
    "He_Dao_Tao": get_select_value("ddlHeDT"),
    "Email_Truong": get_input_value("txtemail"),
    "Email_Ca_Nhan": get_input_value("txtemailcanhan"),
    "Dien_Thoai": get_input_value("txtsdt"),
    "So_CMND": get_input_value("txtcmnd"),
    "Ngay_Cap_CMND": get_input_value("txtcmndngay"),
    "Noi_Cap_CMND": get_input_value("txtcmndnoi"),
    "Dan_Toc": get_select_value("ddldantoc"),
    "Ton_Giao": get_select_value("ddltongiao"),
    "Xuat_Than": get_select_value("ddlxuatthan"),
    "Ngay_Vao_Doan": get_input_value("txtngayvd"),
    "Ngay_Vao_Dang": get_input_value("txtngayvdg"),
    "Ho_Ten_Cha": get_input_value("txtchaht"),
    "Nghe_Nghiep_Cha": get_input_value("txtchann"),
    "SDT_Cha": get_input_value("txtchasdt"),
    "Ho_Ten_Me": get_input_value("txtmeht"),
    "Nghe_Nghiep_Me": get_input_value("txtmenn"),
    "SDT_Me": get_input_value("txtmesdt"),
    "Ho_Ten_Bao_Ho": get_input_value("txtbaohoht"),
    "Thuong_Tru": get_input_value("txtthuongtru"),
    "Quan_Huyen": get_input_value("txtquanhuyen"),
    "Phuong_Xa": get_input_value("txtphuongxa"),
    "Tinh_Tp": get_input_value("txttinhtp"),
    "Dia_Chi_Tam_Tru": get_input_value("txttamtru"),
    "Dia_Chi_Cha": get_input_value("txtdccha"),
    "Dia_Chi_Me": get_input_value("txtdcme"),
    "Dia_Chi_Bao_Ho": get_input_value("txtdcbaoho"),
}

# ✅ In ra kết quả theo đúng định dạng mong muốn
with open("outdata.txt", "w", encoding="utf-8") as file:
    for key, value in student_info.items():
        file.write(f'"{key}": "{value}",\n')  # Giữ dấu " nhưng bỏ { }


print(f"Dữ liệu đã được ghi vào {"outdata.txt"}")
