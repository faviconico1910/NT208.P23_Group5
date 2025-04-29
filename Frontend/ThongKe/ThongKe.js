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

// Lấy dữ liệu GPA từ API Backend dùng cho cập nhật dữ liệu thống kê
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

    const hocKy = document.getElementById("semester-filter").value;
    const namHoc = document.getElementById("year-filter").value;

    const params = new URLSearchParams();
    if (hocKy) params.append("hocKy", hocKy);
    if (namHoc) params.append("namHoc", namHoc);

    const url = `http://127.0.0.1:3000/thongkesv/api?${params.toString()}`;

    try {
        const response = await fetch(url, {
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

        const sinhVienList = data.query;
        const semesterData = data.semesterData || [];
        const drlData = data.drlData || [];

        if (!Array.isArray(sinhVienList)) {
            throw new Error("Dữ liệu từ API không hợp lệ");
        }

        const lopName = sinhVienList.length > 0 ? sinhVienList[0]?.Ma_Lop || "Không rõ" : "Không có dữ liệu";
        document.getElementById("class-name").textContent = `Lớp: ${lopName}`;

        const drlMap = {};
        drlData.forEach(item => {
            drlMap[item.Ma_Sinh_Vien] = parseFloat(item.Diem_Ren_Luyen) || 0; // Đảm bảo chuyển đổi sang số
        });

        const studentsWithDrl = sinhVienList.map(student => ({
            name: student.Ma_Sinh_Vien,
            gpa: student.GPA,
            sum_credits: Number(student.Tong_Tin_Chi),
            drl: drlMap[student.Ma_Sinh_Vien] || 0  // Thêm điểm rèn luyện hoặc 0 nếu không có
        }));

        return {
            students: studentsWithDrl,
            semesters: semesterData,
            drl: drlData
        };
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu GPA:", error);
        // Hiển thị thông báo lỗi cho người dùng
        alert("Lỗi khi tải dữ liệu: " + error.message);
        return { students: [], semesters: [], drl: [] };
    }
};

// Lấy dữ liệu GPA từ API Backend dùng cho vẽ biểu đồ
const fetchGPADataChart = async () => {
    // ✅ Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // ✅ Kiểm tra nếu chưa đăng nhập
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/login.html";
        return;
    }

    console.log("📌 Token từ localStorage:", token);

    const hocKy = document.getElementById("semester-filter-chart").value;
    const namHoc = document.getElementById("year-filter-chart").value;

    const params = new URLSearchParams();
    if (hocKy) params.append("hocKy", hocKy);
    if (namHoc) params.append("namHoc", namHoc);

    const url = `http://127.0.0.1:3000/thongkesv/api?${params.toString()}`;

    try {
        const response = await fetch(url, {
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

        const sinhVienList = data.query;
        const semesterData = data.semesterData || [];
        const drlData = data.drlData || [];

        if (!Array.isArray(sinhVienList)) {
            throw new Error("Dữ liệu từ API không hợp lệ");
        }

        const lopName = sinhVienList.length > 0 ? sinhVienList[0]?.Ma_Lop || "Không rõ" : "Không có dữ liệu";
        document.getElementById("class-name").textContent = `Lớp: ${lopName}`;

        const drlMap = {};
        drlData.forEach(item => {
            drlMap[item.Ma_Sinh_Vien] = parseFloat(item.Diem_Ren_Luyen) || 0; // Đảm bảo chuyển đổi sang số
        });

        const studentsWithDrl = sinhVienList.map(student => ({
            name: student.Ma_Sinh_Vien,
            gpa: student.GPA,
            sum_credits: Number(student.Tong_Tin_Chi),
            drl: drlMap[student.Ma_Sinh_Vien] || 0  // Thêm điểm rèn luyện hoặc 0 nếu không có
        }));

        return {
            students: studentsWithDrl,
            semesters: semesterData,
            drl: drlData
        };
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu GPA:", error);
        // Hiển thị thông báo lỗi cho người dùng
        alert("Lỗi khi tải dữ liệu: " + error.message);
        return { students: [], semesters: [], drl: [] };
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

// Tạo hàm phân loại điểm rèn luyện
const categorizeDRL = (students) => {
    let distribution = { excellent: 0, good: 0, fair: 0, average: 0, weak: 0 };

    students.forEach(student => {
        if (student.drl >= 90) {
            distribution.excellent++;
        } else if (student.drl >= 80) {
            distribution.good++;
        } else if (student.drl >= 70) {
            distribution.fair++;
        } else if (student.drl >= 60) {
            distribution.average++;
        } else {
            distribution.weak++;
        }
    });

    return distribution;
};

const updateStats = (students) => {
    const totalStudents = students.length;
    const totalGPA = students.reduce((sum, student) => sum + parseFloat(student.gpa || 0), 0);
    const totalCredits = students.reduce((sum, student) => sum + (parseFloat(student.sum_credits) || 0), 0);
    
    // Chỉ tính DRL trung bình từ những sinh viên có dữ liệu DRL hợp lệ
    const studentsWithDrl = students.filter(student => parseFloat(student.drl) > 0);
    const totalDrl = studentsWithDrl.reduce((sum, student) => sum + parseFloat(student.drl || 0), 0);
    const drlCount = studentsWithDrl.length;

    const avgGPA = totalStudents > 0 ? (totalGPA / totalStudents).toFixed(2) : 0;
    const avgCredits = totalStudents > 0 ? (totalCredits / totalStudents).toFixed(2) : 0;
    const avgDrl = drlCount > 0 ? (totalDrl / drlCount).toFixed(2) : 0;

    document.getElementById("total-students").textContent = totalStudents;
    document.getElementById("average-gpa").textContent = avgGPA;
    document.getElementById("average-credits").textContent = avgCredits;
    document.getElementById("average-drl").textContent = avgDrl || "0"; // Đảm bảo không hiển thị NaN
};

let pieChartInstance;
let lineChartInstance;
let drlPieChartInstance;
// render các số liệu thống kê
const renderStats = async () => {
    // Lấy dữ liệu GPA sinh viên
    const { students , semesters } = await fetchGPAData();
    
    updateStats(students);
}
// Vẽ biểu đồ sau khi lấy dữ liệu từ API
const renderCharts = async () => {
    // Lấy dữ liệu GPA sinh viên
    const { students, semesters } = await fetchGPADataChart();

    if (students.length === 0) {
        console.warn("Không có dữ liệu GPA để hiển thị.");
        // Xóa biểu đồ cũ nếu có
        if (pieChartInstance) {
            pieChartInstance.destroy();
            pieChartInstance = null;
        }
        if (lineChartInstance) {
            lineChartInstance.destroy();
            lineChartInstance = null;
        }
        if (drlPieChartInstance) {
            drlPieChartInstance.destroy();
            drlPieChartInstance = null;
        }
        return;
    }

    // Xóa biểu đồ line cũ nếu có
    if (lineChartInstance) {
        lineChartInstance.destroy();
    }
    
    // Sắp xếp dữ liệu học kỳ theo thứ tự
    const sortedSemesters = [...semesters].sort((a, b) => a.Hoc_Ky - b.Hoc_Ky);
    
    // Chuẩn bị dữ liệu cho biểu đồ đường
    const semesterLabels = sortedSemesters.map(sem => `HK${sem.Hoc_Ky}`);
    const semesterGPAs = sortedSemesters.map(sem => sem.GPA_Trung_Binh);
    
    // Vẽ biểu đồ đường (Line Chart) với dữ liệu thực từ API
    lineChartInstance = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: semesterLabels.length > 0 ? semesterLabels : ['Không có dữ liệu'],
            datasets: [{
                label: "GPA theo học kỳ",
                backgroundColor: "#1C6DD0",
                borderColor: "#1C6DD0", 
                data: semesterGPAs.length > 0 ? semesterGPAs : [0],
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `GPA: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'GPA'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Học kỳ'
                    }
                }
            }
        }
    });

    // Phân loại GPA từ danh sách sinh viên
    const gpaDistribution = categorizeGPA(students);
    const totalStudents = students.length;

    if (totalStudents === 0) {
        console.warn("Không có dữ liệu GPA để phân loại.");
        return;
    }

    // Tính phần trăm
    const percentageData = Object.values(gpaDistribution).map(value => ((value / totalStudents) * 100).toFixed(2));

    // Xóa biểu đồ tròn cũ nếu có
    if (pieChartInstance) {
        pieChartInstance.destroy();
    }

    // Vẽ biểu đồ tròn (Pie Chart) với tỷ lệ phần trăm
    pieChartInstance = new Chart(document.getElementById("pieChart"), {
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

    const studentsWithDrl = students.filter(student => student.drl > 0);

    if (studentsWithDrl.length > 0) {
        const drlDistribution = categorizeDRL(studentsWithDrl);
        const totalStudentsWithDrl = studentsWithDrl.length;
        
        // Tính phần trăm
        const percentageData = Object.values(drlDistribution).map(value => 
            ((value / totalStudentsWithDrl) * 100).toFixed(2)
        );
        
        // Xóa biểu đồ DRL cũ nếu có
        if (drlPieChartInstance) {
            drlPieChartInstance.destroy();
        }
        
        // Vẽ biểu đồ tròn cho DRL
        const drlChartElement = document.getElementById("drlChart");
        if (drlChartElement) {
            drlPieChartInstance = new Chart(drlChartElement, {
                type: "pie",
                data: {
                    labels: [
                        `Xuất sắc (${percentageData[0]}%)`,
                        `Tốt (${percentageData[1]}%)`,
                        `Khá (${percentageData[2]}%)`,
                        `Trung bình (${percentageData[3]}%)`,
                        `Yếu (${percentageData[4]}%)`
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
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    renderCharts();
    renderStats();

    document.getElementById("filter-btn").addEventListener("click", renderStats);
    document.getElementById("filter-btn-chart").addEventListener("click", renderCharts);

    document.getElementById("reset-btn").addEventListener("click", () => {
        document.getElementById("semester-filter").value = "";
        document.getElementById("year-filter").value = "";
        renderStats();
    });

    document.getElementById("reset-btn-chart").addEventListener("click", () => {
        document.getElementById("semester-filter-chart").value = "";
        document.getElementById("year-filter-chart").value = "";
        renderCharts();
    });
});