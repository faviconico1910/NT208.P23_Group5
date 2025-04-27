const Tai_Khoan = window.location.pathname.split('/')[2];
console.log("Giá trị Tai_Khoan:", Tai_Khoan);
let token = localStorage.getItem("token");

if (!token || !Tai_Khoan) {
    document.getElementById("message").innerText = "Vui lòng đăng nhập lại!";
    setTimeout(() => window.location.href = "/login", 2000);
} else {
    fetchTeacherProfile(token, Tai_Khoan);
}

async function fetchTeacherProfile(token, Tai_Khoan) {
    try {
        console.log("🎯 Token trong localStorage:", localStorage.getItem("token"));
        let response = await fetch(`http://localhost:3000/teacher/api`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        let data = await response.json();
        if (response.ok) {
            updateProfile(data);
        } else {
            document.getElementById("message").textContent = data.message;
        }
    } catch (error) {
        document.getElementById("message").textContent = "Lỗi tải profile!";
    }
}
function updateProfile(data) {
    document.getElementById("name").innerText = data.Ho_Ten || "Không có dữ liệu";
    document.getElementById("mgv").innerText = data.Ma_Giang_Vien || "Không có dữ liệu";
    document.getElementById("faculty").innerText = data.Ma_Khoa|| "Không có dữ liệu";
    document.getElementById("gender").innerText = data.Gioi_Tinh || "Không có dữ liệu";
    document.getElementById("birth").innerText = data.Ngay_Sinh || "Không có dữ liệu";
    document.getElementById("email1").innerText = data.Email_Truong || "Không có dữ liệu";
    document.getElementById("email2").innerText = data.Email_Ca_Nhan || "Không có dữ liệu";
    document.getElementById("cccd").innerText = data.So_CMND || "Không có dữ liệu";
    document.getElementById("religion").innerText = data.Ton_Giao|| "Không có dữ liệu";
    document.getElementById("location").innerText = data.Thuong_Tru|| "Không có dữ liệu";
    document.getElementById("hh").innerText = data.Hoc_Ham|| "Không có dữ liệu";
    document.getElementById("factor").innerText = data.He_So || "Không có dữ liệu";
    document.getElementById("salary").innerText = data.Muc_Luong || "Không có dữ liệu";
    // father
    document.getElementById("father").innerText = data.Ho_Ten_Cha || "Không có dữ liệu";
    document.getElementById("father_phonenumber").innerText = data.SDT_Cha || "Không có dữ liệu";
    document.getElementById("father_job").innerText = data.Nghe_Nghiep_Cha || "Không có dữ liệu";
    // mother
    document.getElementById("mother").innerText = data.Ho_Ten_Me || "Không có dữ liệu";
    document.getElementById("mother_phonenumber").innerText = data.SDT_Me || "Không có dữ liệu";
    document.getElementById("mother_job").innerText = data.Nghe_Nghiep_Me || "Không có dữ liệu";
}

const editBtn = document.getElementById("editBtn");
            
editBtn.addEventListener('click', () => {
    // Đổ dữ liệu hiện tại vào form trong Modal
    document.getElementById('edit-name').value = document.getElementById('name').innerText;
    document.getElementById('edit-email2').value = document.getElementById('email2').innerText;
    document.getElementById('edit-birth').value = document.getElementById('birth').innerText;
    document.getElementById('edit-cccd').value = document.getElementById('cccd').innerText;
    document.getElementById('edit-religion').value = document.getElementById('religion').innerText;
    document.getElementById('edit-gender').value = document.getElementById('gender').innerText;
    document.getElementById('edit-location').value = document.getElementById('location').innerText;
    // Hiển thị Modal
    // const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    // editModal.show();
});

const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", async() => {
    // json data của những thứ cần chỉnh sửa
    const updatedProfile = {
        Ho_Ten: document.getElementById("edit-name").value,
        Email_Ca_Nhan: document.getElementById('edit-email2').value,
        Ngay_Sinh: document.getElementById('edit-birth').value,
        So_CMND: document.getElementById('edit-cccd').value,
        Ton_Giao: document.getElementById('edit-religion').value,
        Gioi_Tinh: document.getElementById('edit-gender').value,
        Thuong_Tru: document.getElementById('edit-location').value,
    };
    try {
        const response = await fetch("http://localhost:3000/teacher/api",
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedProfile)
        });
        // nhận dữ liệu trả về từ backend
        const data = await response.json();
        console.log("Data nhận được :", data);
        if (response.ok)
        {
            updateProfile(data);
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
        }
        else {
            alert(data.message || "Failed");
        }
    } 
    catch (error)
    {
        alert("Debug " + error.message);
    }
});

function logout() {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("Vai_Tro");
    localStorage.removeItem("Tai_Khoan");
    window.location.href = "/login";
}

// fetch sidebar, đoạn này nha mấy cưng ơi, phải có ở trong mỗi page
fetch('/layout/sidebar_teacher.html').then(response => response.text())
.then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    const toggleButton = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");
    const profileContainer = document.querySelector(".profile__container");
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        profileContainer.classList.toggle("collapsed");
        // profileContainer.style.marginLeft = sidebar.classList.contains("collapsed") ? "30px" : "255px";
    })
});
