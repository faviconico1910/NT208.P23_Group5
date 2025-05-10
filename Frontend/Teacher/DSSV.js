document.addEventListener("DOMContentLoaded", async() => {
    let token = localStorage.getItem("token");
    try {
        let res = await fetch("http://localhost:3000/dssv/api", {
            headers: {
                'Authorization': `Bearer ${token}`
            }     
        });

        const data = await res.json();
        const studentTable = document.getElementById("main-container");
        const tableBody = document.getElementById('studentTableBody');

        studentTable.style.display = 'none';
        tableBody.innerHTML = '';
        if (Array.isArray(data) && data.length > 0) {

            studentTable.style.display = 'table';
            data.forEach(sv => {
                const row = `
                <tr>
                  <td>${sv.Ho_Ten}</td>
                  <td>${sv.Ma_Sinh_Vien}</td>
                  <td>${sv.GPA || '-'}</td>
                  <td>${sv.Dien_Thoai || '-'}</td>
                  <td>${sv.SDT_Cha || '-'}</td>
                  <td>${sv.SDT_Me || '-'}</td>
                  <td><button onclick="viewStudentProfile('${sv.Ma_Sinh_Vien}')" class="btn btn-success btn-sm">Xem hồ sơ</button></td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        } else {
            studentTable.style.display = 'none';
            alert("Không có lớp cố vấn");
        }
    }
    catch (error) {
        alert("Lỗi ở file FrontEnd");
    }
});

// search function in Geeks4Geeks

let input = document.getElementById('searchInput');
let table = document.getElementById('studentTableContainer');
let rows = table.getElementsByTagName('tr');
let noMatchMessage = document.getElementById('noMatch');

input.addEventListener('input', function () {
    let filter = input
        .value
        .toLowerCase();
    let matchFound = false;

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        let cells = row
            .getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            let cell = cells[j];
            if (cell.textContent.toLowerCase().indexOf(filter) > -1) {
                found = true;
                matchFound = true;
                break;
            }
        }

        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    if (!matchFound) {
        noMatchMessage.style.display = 'block';
    } else {
        noMatchMessage.style.display = 'none';
    }
});
function viewStudentProfile(mssv) {
    const token = localStorage.getItem("token");
    if (!token || !mssv) {
        alert("Vui lòng đăng nhập lại!");
        window.location.href = "/login";
        return;
    }
    
    // Validate MSSV trước khi lưu
    if (!/^\d{8,10}$/.test(mssv)) {
        alert("MSSV không hợp lệ!");
        return;
    }
    
    // Lưu vào cả localStorage và sessionStorage
    localStorage.setItem('viewingStudentMSSV', mssv);
    sessionStorage.setItem('currentStudentMSSV', mssv);
    sessionStorage.setItem('currentStudentToken', token);
    
    window.location.href = '/completedCourses/KetQuaHocTap';
}

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