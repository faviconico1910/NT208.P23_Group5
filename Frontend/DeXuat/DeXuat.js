fetch('/layout/sidebar.html').then(response => response.text())
            .then(html => {
                document.getElementById("sidebar-container").innerHTML = html
            });

const fetchData = async () => {
    try {
        const response = await fetch("http://127.0.0.1:3000/dexuatmonhoc/api");
        const data = await response.json();
        console.log("Dữ liệu API nhận được:", data);
        if (!data || !Array.isArray(data)) {
            throw new Error("Dữ liệu từ API không hợp lệ");
        }

        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = ""; // Xóa nội dung cũ

        data.forEach(subject => {
            const maMonHocTruoc = subject.Ma_Mon_Hoc_Truoc ? subject.Ma_Mon_Hoc_Truoc : 'Không';
            const row = `
                <tr>
                    <td>${subject.Ma_Mon_Hoc}</td>
                    <td>${subject.Ten_Mon_Hoc}</td>
                    <td>${subject.Ma_Khoa}</td>
                    <td>${subject.Loai_MH}</td>
                    <td>${subject.Tin_chi_LT}</td>
                    <td>${subject.Tin_chi_TH}</td>
                    <td>${maMonHocTruoc}</td>
                    <td>${subject.Do_Kho}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    }  catch (error) {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
    }
};

document.addEventListener("DOMContentLoaded", fetchData);   