fetch('/layout/sidebar.html').then(response => response.text())
.then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    const toggleButton = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Không có token!");
            alert("Vui lòng đăng nhập lại!");
            window.location.href = "/login";
            return;
        }

        // Giải mã token để kiểm tra vai trò
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userRole = decodedToken.Vai_Tro;  
        const userId = decodedToken.Tai_Khoan;

        console.log("User role:", userRole); // Debug log
        console.log("SessionStorage content:", JSON.stringify(sessionStorage)); // Debug log

        // Xác định MSSV cần xem
        let mssvToView;
        if (userRole === 'SinhVien') {
            mssvToView = userId;
        } else if (userRole === 'GiangVien') {
            // Lấy MSSV từ sessionStorage với key chính xác
            mssvToView = sessionStorage.getItem('currentStudentMSSV');
            
            console.log("MSSV from sessionStorage:", mssvToView); // Debug log
            
            if (!mssvToView) {
                alert("Vui lòng chọn sinh viên từ trang hồ sơ trước khi xem lịch học");
                window.location.href = "/dssv";
                return;
            }
        } else {
            alert("Vai trò không hợp lệ!");
            window.location.href = "/login";
            return;
        }

        // Lấy danh sách học kỳ
        let hkResponse = await fetch("/xemlichhoc/hocki", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "x-student-mssv": mssvToView
            }
        });


        let hocKiList = await hkResponse.json();
        console.log("🎓 Danh sách học kỳ:", hocKiList);

        const listHocKi = document.getElementById("list-hocki");
        listHocKi.innerHTML = ''; // Xóa các mục cũ trước khi thêm mới
        
        hocKiList.forEach(hk => {
            let li = document.createElement("li");
            li.classList.add("dropdown-item");
            li.textContent = "Học kỳ " + hk.Hoc_Ki;
            li.addEventListener("click", () => {
                loadThoiKhoaBieu(hk.Hoc_Ki);
            });
            listHocKi.appendChild(li);
        });

        // 👉 Tự động load học kỳ đầu tiên (lớn nhất)
        if (hocKiList.length > 0) {
            loadThoiKhoaBieu(hocKiList[0].Hoc_Ki);
        }

        async function loadThoiKhoaBieu(hocki) {
            let url = `/xemlichhoc/api/current/${mssvToView}?hocKi=${hocki}`;
        
            let response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "x-student-mssv": mssvToView
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let data = await response.json();
            console.log("📌 Dữ liệu từ API:", data);
            let tableBody = document.getElementById("table-body");
            
            let timetable = {};
            let rowspanTracker = {}; // Lưu số lượng tiết cần merge
            let skippedCells = {}; // Lưu ô nào đã bị merge để bỏ qua
            
            for (let i = 1; i <= 12; i++) {
                timetable[i] = { "Thứ 2": "", "Thứ 3": "", "Thứ 4": "", "Thứ 5": "", "Thứ 6": "", "Thứ 7": "" };
            }
            
            data.forEach(row => {
                let { Tiet_Bat_Dau, Tiet_Ket_Thuc, Thu, Ma_Lop_Hoc } = row;
                let thuKey = "Thứ " + Thu;
                
                // Chỉ lưu môn học vào tiết đầu tiên
                timetable[Tiet_Bat_Dau][thuKey] = Ma_Lop_Hoc;
                rowspanTracker[`${Tiet_Bat_Dau}-${thuKey}`] = Tiet_Ket_Thuc - Tiet_Bat_Dau + 1; // Số tiết cần merge
                
                // Đánh dấu các tiết bị merge để không hiển thị lại
                for (let i = Tiet_Bat_Dau + 1; i <= Tiet_Ket_Thuc; i++) {
                    skippedCells[`${i}-${thuKey}`] = true;
                }
            });
            
            tableBody.innerHTML = ''; // Xóa dữ liệu cũ trước khi thêm mới

            for (let i = 1; i <= 12; i++) {
                if (i === 6) {
                    tableBody.innerHTML += `<tr><td colspan='7' style='text-align:center; font-weight:bold;'>Nghỉ Trưa</td></tr>`;
                }
                let tr = `<tr><td>Tiết ${i}</td>`;
                
                for (let j = 2; j <= 7; j++) {
                    let thuKey = "Thứ " + j;
                    
                    // Nếu ô này đã bị merge thì bỏ qua
                    if (skippedCells[`${i}-${thuKey}`]) continue;
                    
                    let cellContent = timetable[i][thuKey];
                    
                    if (rowspanTracker[`${i}-${thuKey}`]) {
                        tr += `<td rowspan="${rowspanTracker[`${i}-${thuKey}`]}">${cellContent}</td>`;
                    } else {
                        tr += `<td></td>`; // Chỉ thêm nếu không có rowspan
                    }
                }
                
                tr += `</tr>`;
                tableBody.innerHTML += tr;
            }
        }
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        alert("Có lỗi xảy ra khi tải lịch học. Vui lòng thử lại!");
    }
});