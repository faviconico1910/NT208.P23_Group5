fetch('/layout/sidebar.html').then(response => response.text())
.then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    const toggleButton = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
});
console.log("Đang trong javascript");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
            console.error("❌ Không có token!");
            alert("Vui lòng đăng nhập lại!");
            window.location.href = "/login";
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

        if (!ttcResponse.ok) {
            throw new Error("Không thể lấy dữ liệu điểm rèn luyện");
        }

        let ttcData = await ttcResponse.json();
        console.log("📊 Dữ liệu điểm rèn luyện:", ttcData);

        let nganhResponse = await fetch("/huongdanXTN/sv", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!nganhResponse.ok) {
            throw new Error("Không thể lấy dữ liệu điểm rèn luyện");
        }
        let nganhData = await nganhResponse.json();
        console.log("📊 Dữ liệu điểm rèn luyện:", nganhData);

        const nganh = nganhData[0]?.Ma_Nganh;
        const tongtinchi = ttcData[0]?.Tong_Tin_Chi_Tich_Luy;
        const khoa = ttcData[0]?.Khoa;
        const ttcNote = document.getElementById("TinChi");

        if (ttcNote) {
            if (nganh === "ATTT") {
                if(khoa === "K19" && tongtinchi >= 129){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K19" && tongtinchi < 129)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
                if(khoa === "K18" && tongtinchi >= 129){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K18" && tongtinchi < 129)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
                if(khoa === "K17" && tongtinchi >= 129){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K17" && tongtinchi < 129)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
                if(khoa === "K16" && tongtinchi >= 129){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K16" && tongtinchi < 129)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 129</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
            } else if (nganh === "MMT") {
                if(khoa === "K19" && tongtinchi >= 130){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K19" && tongtinchi < 130)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
                if(khoa === "K18" && tongtinchi >= 130){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K18" && tongtinchi < 130)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
                if(khoa === "K17" && tongtinchi >= 130){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K17" && tongtinchi < 130)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
                if(khoa === "K16" && tongtinchi >= 130){
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>`;
                    ttcNote.classList.add("note-success");
                }
                else if(khoa === "K16" && tongtinchi < 130)
                {
                    ttcNote.innerHTML = `
                        <i class="fas fa-exclamation-circle note-icon"></i>
                        <div class="note-content">
                            <div class="note-title">Lưu ý</div>
                            <p>Yêu cầu xét tốt nghiệp <b>>= 130</b>, tín chỉ tích lũy hiện tại <b>${tongtinchi}</b>.</p>
                        </div>
                    `;
                    ttcNote.classList.add("note");
                }
            }
        }
        // 👉 Lấy điểm rèn luyện
        let drlResponse = await fetch("/huongdanXTN/drl", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!drlResponse.ok) {
            throw new Error("Không thể lấy dữ liệu điểm rèn luyện");
        }

        let drlData = await drlResponse.json();
        console.log("📊 Dữ liệu điểm rèn luyện:", drlData);

        const diemRenLuyen = drlData[0]?.Trung_Binh_Ren_Luyen;
        const drlNote = document.getElementById("DiemRL");

        if (drlNote) {
            if (diemRenLuyen >= 50) {
                drlNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên có điểm rèn luyện <b>ĐẠT</b> yêu cầu xét tốt nghiệp <b>${diemRenLuyen}</b> >= 50</p>
                    </div>
                `;
                drlNote.classList.add("note-success");
            } else {
                drlNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên có điểm rèn luyện <b>CHƯA ĐẠT</b> yêu cầu xét tốt nghiệp <b>${diemRenLuyen}</b> >= 50</p>
                    </div>
                `;
                
                drlNote.classList.add("note");
            }
        }
        // 👉 Lấy chứng chỉ Ngoại ngữ
        let nnResponse = await fetch("/huongdanXTN/chungchi", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!nnResponse.ok) {
            throw new Error("Không thể lấy dữ liệu điểm rèn luyện");
        }
        let nnData = await nnResponse.json();
        console.log("📊 Dữ liệu điểm rèn luyện:", nnData);

        let svResponse = await fetch("/huongdanXTN/sv",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!svResponse.ok) {
            throw new Error("Không thể lấy dữ liệu điểm rèn luyện");
        }
        let svData = await svResponse.json();
        console.log("📊 Dữ liệu điểm rèn luyện:", svData);

        const nn = nnData[0]?.Chung_Chi_Anh_Van;
        const sv = svData[0]?.Nam_Nhap_Hoc;
        const nnNote = document.getElementById("NN");

        if (nnNote) {
            if (nn === "Có") {
                nnNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>ĐÃ</b> nộp chứng chỉ ngoại ngữ.</p>
                    </div>
                `;
                nnNote.classList.add("note-success");
            } else if (nn === "Chưa có" && Nam_Nhap_Hoc >= 2022) {
                nnNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>CHƯA</b> nộp Chứng chỉ TOEIC 4 kỹ năng (Nghe-Đọc 450, Nói-Viết 185).</p>
                    </div>
                `;
                
                nnNote.classList.add("note");
            } else if (nn === "Chưa có" && Nam_Nhap_Hoc >= 2019 && Nam_Nhap_Hoc <= 2021) {
                nnNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>CHƯA</b> nộp Chứng chỉ TOEIC 4 kỹ năng (Nghe-Đọc 450, Nói-Viết 205).</p>
                    </div>
                `;
                nnNote.classList.add("note");
            }
        }
        // 👉 Lấy chứng chỉ Quốc Phòng
        let qpResponse = await fetch("/huongdanXTN/chungchi", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!qpResponse.ok) {
            throw new Error("Không thể lấy dữ liệu điểm rèn luyện");
        }

        let qpData = await qpResponse.json();
        console.log("📊 Dữ liệu điểm rèn luyện:", nnData);

        const qp = qpData[0]?.Chung_Chi_Quan_Su;
        const qpNote = document.getElementById("GDQP");

        if (qpNote) {
            if (qp === "Có") {
                qpNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>ĐÃ</b> nộp chứng chỉ Giáo dục Quốc phòng & An ninh.</p>
                    </div>
                `;
                
                qpNote.classList.add("note-success");
            } else if (qp === "Chưa có") {
                qpNote.innerHTML = `
                    <i class="fas fa-exclamation-circle note-icon"></i>
                    <div class="note-content">
                        <div class="note-title">Lưu ý</div>
                        <p>Sinh viên <b>CHƯA</b> nộp chứng chỉ Giáo dục Quốc phòng & An ninh.</p>
                    </div>
                `;
                qpNote.classList.add("note");
            }
        }
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
});
