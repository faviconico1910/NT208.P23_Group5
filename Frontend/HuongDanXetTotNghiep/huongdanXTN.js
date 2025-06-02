fetch('/layout/sidebar.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} when fetching sidebar.html`);
        }
        return response.text();
    })
    .then(html => {
        const sidebarContainer = document.getElementById("sidebar-container");
        if (sidebarContainer) {
            sidebarContainer.innerHTML = html;
        } else {
            console.error("#sidebar-container not found in the document.");
            return;
        }

        const toggleButton = document.getElementById("toggle-btn");
        const sidebarElement = document.getElementById("sidebar"); 
        const bodyElement = document.body; 

        if (toggleButton && sidebarElement) {
            toggleButton.addEventListener("click", () => {
                sidebarElement.classList.toggle("collapsed");
                bodyElement.classList.toggle("sidebar-collapsed"); 
            });
        } else {
            console.error("Sidebar toggle button (#toggle-btn) or sidebar element (#sidebar) not found. Make sure these IDs exist in /layout/sidebar.html.");
        }
    })
    .catch(error => {
        console.error("Error fetching or processing sidebar.html:", error);
        const sidebarContainer = document.getElementById("sidebar-container");
        if (sidebarContainer) {
            sidebarContainer.innerHTML = "<p style='color:red; padding:10px;'>Lỗi tải sidebar. Vui lòng thử lại.</p>";
        }
    });

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Không có token!");
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.2em;">Vui lòng <a href="/login">đăng nhập</a> để xem nội dung này.</div>`;
            return;
        }
        // 👉 Lấy tổng tín chỉ
        let ttcResponse = await fetch("/huongdanXTN/tinchi", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        // Kiểm tra nếu token hết hạn hoặc không hợp lệ từ phản hồi của API
        if (ttcResponse.status === 401 || ttcResponse.status === 403) {
            console.error("Token không hợp lệ hoặc đã hết hạn.");
            localStorage.removeItem("token"); // Xóa token cũ
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.2em;">Phiên đăng nhập đã hết hạn. Vui lòng <a href="/login">đăng nhập lại</a>.</div>`;
            return;
        }

        if (!ttcResponse.ok) {
            throw new Error(`Không thể lấy dữ liệu tổng tín chỉ (status: ${ttcResponse.status})`);
        }

        let ttcData = await ttcResponse.json();

        let nganhResponse = await fetch("/huongdanXTN/sv", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (nganhResponse.status === 401 || nganhResponse.status === 403) {
             console.error("Token không hợp lệ hoặc đã hết hạn khi lấy thông tin SV.");
            localStorage.removeItem("token");
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.2em;">Phiên đăng nhập đã hết hạn. Vui lòng <a href="/login">đăng nhập lại</a>.</div>`;
            return;
        }
        if (!nganhResponse.ok) {
            throw new Error(`Không thể lấy dữ liệu sinh viên (status: ${nganhResponse.status})`);
        }
        let nganhData = await nganhResponse.json();

        const nganh = nganhData[0]?.Ma_Nganh;
        const tongtinchi = ttcData[0]?.Tong_Tin_Chi_Tich_Luy;
        const khoa = nganhData[0]?.Khoa; 
        const ttcNote = document.getElementById("TinChi");

        if (ttcNote) {
            let requiredCredits = 0;
            if (nganh === "ATTT") requiredCredits = 129;
            else if (nganh === "MMT") requiredCredits = 130;

            if (requiredCredits > 0) {
                 ttcNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Yêu cầu xét tốt nghiệp <b>>= ${requiredCredits}</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi !== null && tongtinchi !== undefined ? tongtinchi : 'N/A'}</b>.</p>
                    </div>`;
                if (tongtinchi >= requiredCredits) {
                    ttcNote.classList.add("note-success");
                    ttcNote.classList.remove("note");
                } else {
                    ttcNote.classList.add("note");
                    ttcNote.classList.remove("note-success");
                }
            } else {
                 ttcNote.innerHTML = `
                    <i class="fas fa-info-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Thông tin tín chỉ</div>
                        <p>Không xác định được yêu cầu tín chỉ cho ngành <b>${nganh || 'N/A'}</b> hoặc bạn chưa có tín chỉ nào (<b>${tongtinchi !== null && tongtinchi !== undefined ? tongtinchi : 'N/A'}</b>).</p>
                    </div>`;
                ttcNote.classList.add("note"); 
            }
        } else {
            console.warn("#TinChi element not found");
        }
        let drlResponse = await fetch("/huongdanXTN/drl", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (drlResponse.status === 401 || drlResponse.status === 403) {
             console.error("Token không hợp lệ hoặc đã hết hạn khi lấy ĐRL.");
            localStorage.removeItem("token");
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.2em;">Phiên đăng nhập đã hết hạn. Vui lòng <a href="/login">đăng nhập lại</a>.</div>`;
            return;
        }
        if (!drlResponse.ok) {
            throw new Error(`Không thể lấy dữ liệu điểm rèn luyện (status: ${drlResponse.status})`);
        }

        let drlData = await drlResponse.json();

        const diemRenLuyen = drlData[0]?.Trung_Binh_Ren_Luyen;
        const drlNote = document.getElementById("DiemRL");

        if (drlNote) {
            if (diemRenLuyen !== null && diemRenLuyen !== undefined) {
                if (diemRenLuyen >= 50) {
                    drlNote.innerHTML = `
                        <i class="fas fa-check-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Sinh viên có điểm rèn luyện <b>ĐẠT</b> yêu cầu xét tốt nghiệp (<b>${diemRenLuyen}</b> / 50).</p>
                        </div>
                    `;
                    drlNote.classList.add("note-success");
                    drlNote.classList.remove("note");
                } else {
                    drlNote.innerHTML = `
                        <i class="fas fa-times-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Sinh viên có điểm rèn luyện <b>CHƯA ĐẠT</b> yêu cầu xét tốt nghiệp (<b>${diemRenLuyen}</b> / 50).</p>
                        </div>
                    `;
                    drlNote.classList.add("note");
                    drlNote.classList.remove("note-success");
                }
            } else {
                drlNote.innerHTML = `
                    <i class="fas fa-info-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Chưa có thông tin điểm rèn luyện.</p>
                    </div>
                `;
                drlNote.classList.add("note");
            }
        } else {
            console.warn("#DiemRL element not found");
        }
        let chungchiResponse = await fetch("/huongdanXTN/chungchi", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (chungchiResponse.status === 401 || chungchiResponse.status === 403) {
             console.error("Token không hợp lệ hoặc đã hết hạn khi lấy chứng chỉ.");
            localStorage.removeItem("token");
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.2em;">Phiên đăng nhập đã hết hạn. Vui lòng <a href="/login">đăng nhập lại</a>.</div>`;
            return;
        }

        if (!chungchiResponse.ok) {
            throw new Error(`Không thể lấy dữ liệu chứng chỉ (status: ${chungchiResponse.status})`);
        }
        let chungchiData = await chungchiResponse.json();

        const namNhapHoc = nganhData[0]?.Nam_Nhap_Hoc; 
        const chungChiAnhVan = chungchiData[0]?.Chung_Chi_Anh_Van;
        const nnNote = document.getElementById("NN");

        if (nnNote) {
            if (chungChiAnhVan === "Có") {
                nnNote.innerHTML = `
                    <i class="fas fa-check-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>ĐÃ</b> nộp chứng chỉ ngoại ngữ.</p>
                    </div>
                `;
                nnNote.classList.add("note-success");
                nnNote.classList.remove("note");
            } else if (chungChiAnhVan === "Chưa có") {
                let requirementText = "Chưa xác định yêu cầu cụ thể.";
                if (namNhapHoc >= 2022) {
                    requirementText = "Chứng chỉ TOEIC 4 kỹ năng (Nghe-Đọc 450, Nói-Viết 185).";
                } else if (namNhapHoc >= 2019 && namNhapHoc <= 2021) {
                    requirementText = "Chứng chỉ TOEIC 4 kỹ năng (Nghe-Đọc 450, Nói-Viết 205).";
                }
                nnNote.innerHTML = `
                    <i class="fas fa-times-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>CHƯA</b> nộp. Yêu cầu: ${requirementText}</p>
                    </div>
                `;
                nnNote.classList.add("note");
                nnNote.classList.remove("note-success");
            } else {
                 nnNote.innerHTML = `
                    <i class="fas fa-info-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Trạng thái chứng chỉ ngoại ngữ không xác định.</p>
                    </div>
                `;
                nnNote.classList.add("note");
            }
        } else {
             console.warn("#NN element not found");
        }

        const chungChiQuanSu = chungchiData[0]?.Chung_Chi_Quan_Su;
        const qpNote = document.getElementById("GDQP");

        if (qpNote) {
            if (chungChiQuanSu === "Có") {
                qpNote.innerHTML = `
                    <i class="fas fa-check-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>ĐÃ</b> nộp chứng chỉ Giáo dục Quốc phòng & An ninh.</p>
                    </div>
                `;
                qpNote.classList.add("note-success");
                qpNote.classList.remove("note");
            } else if (chungChiQuanSu === "Chưa có") {
                qpNote.innerHTML = `
                    <i class="fas fa-times-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>CHƯA</b> nộp chứng chỉ Giáo dục Quốc phòng & An ninh.</p>
                    </div>
                `;
                qpNote.classList.add("note");
                qpNote.classList.remove("note-success");
            } else {
                 qpNote.innerHTML = `
                    <i class="fas fa-info-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Trạng thái chứng chỉ GDQP&AN không xác định.</p>
                    </div>
                `;
                qpNote.classList.add("note");
            }
        } else {
            console.warn("#GDQP element not found");
        }

    } catch (error) {
        console.error("Lỗi tổng thể khi tải dữ liệu trang Hướng dẫn XTN:", error);
        const mainContent = document.querySelector(".main-content");
        if(mainContent){
            mainContent.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.2em; color: red;">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau. <br><small>${error.message}</small></div>`;
        }
    }
});