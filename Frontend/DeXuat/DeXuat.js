fetch('/layout/sidebar.html').then(response => response.text())
.then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    const toggleButton = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        document.querySelector(".main-container").classList.toggle("collapsed");
    })
});

let responseData = {};
let deXuatList = [];
let hocLaiList = [];
let tuChonList = [];
let chuyenNganhList = [];
let chuyenDeList = [];

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/login.html";
        return;
    }
    
    try {
        // const tbody = document.querySelector("table tbody");
        const dexuatTbody = document.getElementById("dexuat-tbody");
        const retakeTbody = document.getElementById("retake-tbody");
        const majorTbody = document.getElementById("major-tbody");
        const electiveTbody = document.getElementById("elective-tbody");
        const specialTbody = document.getElementById("special-tbody");

        dexuatTbody.innerHTML = "<tr><td colspan='7' class='text-center'>Đang tải dữ liệu...</td></tr>";
        retakeTbody.innerHTML = "<tr><td colspan='7' class='text-center'>Đang tải dữ liệu...</td></tr>";
        majorTbody.innerHTML = "<tr><td colspan='6' class='text-center'>Đang tải dữ liệu...</td></tr>";
        electiveTbody.innerHTML = "<tr><td colspan='6' class='text-center'>Đang tải dữ liệu...</td></tr>";
        specialTbody.innerHTML = "<tr><td colspan='6' class='text-center'>Đang tải dữ liệu...</td></tr>";

        const response = await fetch("/dexuatmonhoc/api", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.message || "Lỗi không xác định";
            throw new Error(`Lỗi ${response.status}: ${errorMessage}`);
        }

        // ✅ Hiển thị môn học đề xuất
        deXuatList = responseData.de_xuat || [];
        if (deXuatList.length === 0) {
            dexuatTbody.innerHTML = "<tr><td colspan='7' class='text-center'>Không có dữ liệu môn học đề xuất</td></tr>";
        } else {
            dexuatTbody.innerHTML = "";
            deXuatList.forEach((subject, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${subject.Ma_Mon_Hoc}</td>
                        <td>${subject.Ten_Mon_Hoc}</td>
                        <td>${subject.Tin_chi_LT}</td>
                        <td>${subject.Tin_chi_TH}</td>
                        <td>${subject.Ma_Mon_Tien_Quyet || "Không"}</td>
                        <td>
                            <button class="add-btn tab-btn" data-mamh="${subject.Ma_Mon_Hoc}">Thêm</button>
                        </td>
                    </tr>
                `;
                dexuatTbody.innerHTML += row;
            });

            ganSuKienThemMonHoc();
        }

        // ✅ Hiển thị môn học cần học lại
        hocLaiList = responseData.hoc_lai || [];
        if (hocLaiList.length === 0) {
            retakeTbody.innerHTML = "<tr><td colspan='6' class='text-center'>Không có dữ liệu môn học cần học lại</td></tr>";
        } else {
            retakeTbody.innerHTML = "";
            hocLaiList.forEach((subject, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${subject.Ma_Mon_Hoc}</td>
                        <td>${subject.Ten_Mon_Hoc}</td>
                        <td>${subject.Tin_chi_LT}</td>
                        <td>${subject.Tin_chi_TH}</td>
                        <td>
                            <button class="add-btn tab-btn" data-mamh="${subject.Ma_Mon_Hoc}">Thêm</button>
                        </td>
                    </tr>
                `;
                retakeTbody.innerHTML += row;
            });

            ganSuKienThemMonHoc();
        }

        // ✅ Hiển thị môn học chuyên ngành
        chuyenNganhList = responseData.chuyen_nganh || [];
        if (chuyenNganhList.length === 0) {
            majorTbody.innerHTML = "<tr><td colspan='6' class='text-center'>Không có dữ liệu môn học chuyên ngành</td></tr>";
        } else {
            majorTbody.innerHTML = "";
            chuyenNganhList.forEach((subject, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${subject.Ma_Mon_Hoc}</td>
                        <td>${subject.Ten_Mon_Hoc}</td>
                        <td>${subject.Tin_chi_LT}</td>
                        <td>${subject.Tin_chi_TH}</td>
                        <td>
                            <button class="add-btn tab-btn" data-mamh="${subject.Ma_Mon_Hoc}">Thêm</button>
                        </td>
                    </tr>
                `;
                majorTbody.innerHTML += row;
            });

            ganSuKienThemMonHoc();
        }

        // ✅ Hiển thị môn học tự chọn
        tuChonList = responseData.tu_chon || [];
        if (tuChonList.length === 0) {
            electiveTbody.innerHTML = "<tr><td colspan='6' class='text-center'>Không có dữ liệu môn học tự chọn</td></tr>";
        } else {
            electiveTbody.innerHTML = "";
            tuChonList.forEach((subject, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${subject.Ma_Mon_Hoc}</td>
                        <td>${subject.Ten_Mon_Hoc}</td>
                        <td>${subject.Tin_chi_LT}</td>
                        <td>${subject.Tin_chi_TH}</td>
                        <td>
                            <button class="add-btn tab-btn" data-mamh="${subject.Ma_Mon_Hoc}">Thêm</button>
                        </td>
                    </tr>
                `;
                electiveTbody.innerHTML += row;
            });

            ganSuKienThemMonHoc();
        }

         // ✅ Hiển thị môn học chuyên đề
        chuyenDeList = responseData.chuyen_de || [];
        if (chuyenDeList.length === 0) {
            specialTbody.innerHTML = "<tr><td colspan='6' class='text-center'>Không có dữ liệu môn học chuyên đề</td></tr>";
        } else {
            specialTbody.innerHTML = "";
            chuyenDeList.forEach((subject, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${subject.Ma_Mon_Hoc}</td>
                        <td>${subject.Ten_Mon_Hoc}</td>
                        <td>${subject.Tin_chi_LT}</td>
                        <td>${subject.Tin_chi_TH}</td>
                        <td>
                        <button class="add-btn tab-btn" data-mamh="${subject.Ma_Mon_Hoc}">Thêm</button>
                    </td>
                    </tr>
                `;
                specialTbody.innerHTML += row;
            });

            ganSuKienThemMonHoc();
        }
    } catch (error) {
        console.error("🚨 Lỗi khi tải dữ liệu từ API:", error);
        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = `<tr><td colspan='7' class='text-center text-danger'>${error.message}</td></tr>`;
    }
});

const tabButtons = document.querySelectorAll(".tab-btn");
  const tableSections = document.querySelectorAll(".table-section");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Xóa active của tất cả nút
      tabButtons.forEach(b => b.classList.remove("active"));

      // Ẩn tất cả bảng
      tableSections.forEach(section => section.classList.add("d-none"));

      // Hiện bảng được chọn
      const targetId = btn.getAttribute("data-target");
      document.querySelector(targetId).classList.remove("d-none");

      // Đánh dấu nút đang active
      btn.classList.add("active");
    });
  });

function ganSuKienThemMonHoc() {
    document.querySelectorAll(".add-btn").forEach(button => {
        button.onclick = function () {
            const maMH = this.dataset.mamh;
            const isAdded = themMonHocDaChon(maMH);  // Thêm thành công thì mới update nút

            if (isAdded) {
                this.textContent = "Đã thêm";
                this.disabled = true;
                this.classList.add("added-btn");
            }
        };
    });
}

function themMonHocDaChon(maMH) {
    const daChonTbody = document.getElementById("daChon-tbody");

    const daTonTai = Array.from(daChonTbody.children).some(row =>
        row.querySelector("td:nth-child(2)").textContent === maMH
    );
    if (daTonTai) {
        alert("Môn học đã được chọn!");
        return;
    }

    // Tìm trong tất cả danh sách
    const allSubjects = [
        ...(deXuatList || []),
        ...(responseData?.hoc_lai || []),
        ...(responseData?.chuyen_nganh || []),
        ...(responseData?.tu_chon || []),
        ...(responseData?.chuyen_de || [])
    ];

    const monHoc = allSubjects.find(item => item.Ma_Mon_Hoc === maMH);
    if (!monHoc) {
        alert("Không tìm thấy thông tin môn học!");
        return;
    }

    const rowCount = daChonTbody.rows.length + 1;
    const row = `
        <tr>
            <td>${rowCount}</td>
            <td>${monHoc.Ma_Mon_Hoc}</td>
            <td>${monHoc.Ten_Mon_Hoc}</td>
            <td>${monHoc.Tin_chi_LT}</td>
            <td>${monHoc.Tin_chi_TH}</td>
            <td><button class="remove-btn tab-btn">Xóa</button></td>
        </tr>
    `;
    daChonTbody.insertAdjacentHTML("beforeend", row);

    daChonTbody.querySelectorAll(".remove-btn").forEach(btn => {
        btn.onclick = function () {
            const row = this.closest("tr");
            const maMH = row.children[1].textContent;
            row.remove();
            capNhatTongTinChi();
            capNhatSTTMonHocDaChon();

            // Bật lại nút “Thêm”
            const button = document.querySelector(`.add-btn[data-mamh="${maMH}"]`);
            if (button) {
                button.textContent = "Thêm";
                button.disabled = false;
                button.classList.remove("added-btn");
            }
        };
    });

    capNhatTongTinChi();
    return true;
}

  
function capNhatTongTinChi() {
    let tongLT = 0, tongTH = 0;
    const daChonTbody = document.getElementById("daChon-tbody");

    Array.from(daChonTbody.children).forEach(row => {
        const tcLT = parseInt(row.children[3].textContent) || 0;
        const tcTH = parseInt(row.children[4].textContent) || 0;
        tongLT += tcLT;
        tongTH += tcTH;
    });
    
    document.getElementById("tong-tin-chi").textContent = tongLT + tongTH;
    document.getElementById("tong-tin-chi-ly-thuyet").textContent = tongLT;
    document.getElementById("tong-tin-chi-thuc-hanh").textContent = tongTH;
}

function capNhatSTTMonHocDaChon() {
    const rows = document.querySelectorAll("#daChon-tbody tr");
    rows.forEach((row, index) => {
        row.children[0].textContent = index + 1;
    });
}
document.getElementById("btnXoaHet").addEventListener("click", function () {
    const daChonTbody = document.getElementById("daChon-tbody");
    // Lấy danh sách các mã môn đã chọn trước khi xoá
    const maMonHocList = Array.from(daChonTbody.querySelectorAll("tr")).map(row =>
        row.children[1].textContent
    );

    // Xoá hết hàng
    daChonTbody.innerHTML = "";
    capNhatTongTinChi();

    // Bật lại các nút "Thêm"
    maMonHocList.forEach(maMH => {
        const button = document.querySelector(`.add-btn[data-mamh="${maMH}"]`);
        if (button) {
            button.textContent = "Thêm";
            button.disabled = false;
            button.classList.remove("added-btn");
        }
    });
});