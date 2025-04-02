fetch('/layout/sidebar.html').then(response => response.text())
.then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    const toggleButton = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    })
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
            console.error("❌ Không có token!");
            alert("Vui lòng đăng nhập lại!");
            window.location.href = "/login";
            return;
        }

        console.log("📌 Gửi request với token:", token);
        let response = await fetch("http://127.0.0.1:3000/xemlichhoc/api", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        });
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
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
});