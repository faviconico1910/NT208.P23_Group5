fetch('/layout/sidebar_teacher.html').then(response => response.text())
.then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    const toggleButton = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        document.querySelector(".main-container").classList.toggle("collapsed");
    })
});

// Lấy dữ liệu GPA từ API Backend
const fetchGPAData = async () => {
    // ✅ Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // ✅ Kiểm tra nếu chưa đăng nhập
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/login.html";
        return;
    }

    console.log("📌 Token từ localStorage:", token);

    try {
        const response = await fetch("http://127.0.0.1:3000/thongkesv/api", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Lỗi khi tải dữ liệu. Có thể token không hợp lệ!");
        }

        const data = await response.json();
        console.log("📩 Dữ liệu API nhận được:", data); 

        if (!data || !Array.isArray(data.sinhVien)) {
            throw new Error("Dữ liệu từ API không hợp lệ");
        }

        document.getElementById("class-name").textContent = `Lớp: ${data.Ma_Lop}`;

        return data.sinhVien.map(student => ({
            name: student.Ma_Sinh_Vien,
            gpa: student.GPA,
            sum_credits: Number(student.Tong_Tin_Chi)
        }));
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu GPA:", error);
        return [];
    }
};



// Phân loại GPA theo mức
const categorizeGPA = (gpaList) => {
    let distribution = { excellent: 0, good: 0, fair: 0, average: 0, weak: 0 };

    gpaList.forEach(student => {
        if (student.gpa >= 9.0) {
            distribution.excellent++;
        } else if (student.gpa >= 8) {
            distribution.good++;
        } else if (student.gpa >= 6.5) {
            distribution.fair++;
        } else if (student.gpa >= 5) {
            distribution.average++;
        } else {
            distribution.weak++;
        }

    });

    return distribution;
};

const updateStats = (gpaData) => {
    const totalStudents = gpaData.length;
    const totalGPA = gpaData.reduce((sum, student) => sum + student.gpa, 0);
    const totalCredits = gpaData.reduce((sum, student) => sum + student.sum_credits, 0);

    const avgGPA = totalStudents > 0 ? (totalGPA / totalStudents).toFixed(2) : 0;
    const avgCredits = totalStudents > 0 ? (totalCredits / totalStudents).toFixed(2) : 0;

    document.getElementById("total-students").textContent = totalStudents;
    document.getElementById("average-gpa").textContent = avgGPA;
    document.getElementById("average-credits").textContent = avgCredits;

};

// Vẽ biểu đồ sau khi lấy dữ liệu từ API
const renderCharts = async () => {
    // Lấy dữ liệu GPA sinh viên
    const gpaData = await fetchGPAData();
    
    updateStats(gpaData);

    if (gpaData.length === 0) {
        console.warn("Không có dữ liệu GPA để hiển thị.");
        return;
    }

    // Vẽ biểu đồ cột (Bar Chart)
    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: gpaData.map(student => student.name),
            datasets: [{
                label: "GPA",
                backgroundColor: "#1C6DD0",
                borderColor: "#1C6DD0", 
                data: gpaData.map(student => student.gpa)
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    display: false // Ẩn trục X luôn
                },
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
        
    });

    // Phân loại GPA từ danh sách sinh viên
    const gpaDistribution = categorizeGPA(gpaData);
    const totalStudents = gpaData.length;

    if (totalStudents === 0) {
        console.warn("Không có dữ liệu GPA để phân loại.");
        return;
    }

    // Tính phần trăm
    const percentageData = Object.values(gpaDistribution).map(value => ((value / totalStudents) * 100).toFixed(2));

    // Vẽ biểu đồ tròn (Pie Chart) với tỷ lệ phần trăm
    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: [
                `Xuất sắc (${percentageData[0]}%)`,
                `Giỏi (${percentageData[1]}%)`,
                `Khá (${percentageData[2]}%)`,
                `Trung bình (${percentageData[3]}%)`,
                `Kém (${percentageData[4]}%)`
            ],
            datasets: [{
                backgroundColor: ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#8E44AD"],
                data: percentageData,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                        }
                    }
                }
            }
        }
    });
};

// Gọi hàm vẽ biểu đồ khi trang tải xong
document.addEventListener("DOMContentLoaded", renderCharts);
