// Sidebar
fetch('/layout/sidebar_teacher.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;
        const toggleButton = document.getElementById("toggle-btn");
        const sidebar = document.getElementById("sidebar");

        toggleButton.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            document.querySelector(".main-container").classList.toggle("collapsed");
        });
    });

// Fetch Data
const fetchGPAData = async () => {
    const token = localStorage.getItem("token");
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
    const url = `/thongkesv/api?${params.toString()}`;

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
        const soDatNgoaiNguData = data.soDatNgoaiNgu;
        const gioiTinhData = data.gioiTinh;

        if (!Array.isArray(sinhVienList)) {
            throw new Error("Dữ liệu từ API không hợp lệ");
        }

        const lopName = sinhVienList.length > 0 ? sinhVienList[0]?.Ma_Lop || "Không rõ" : "Không có dữ liệu";
        document.getElementById("class-name").textContent = `Lớp: ${lopName}`;

        const drlMap = {};
        drlData.forEach(item => {
            drlMap[item.Ma_Sinh_Vien] = parseFloat(item.Diem_Ren_Luyen) || 0;
        });

        const studentsWithDrl = sinhVienList.map(student => ({
            name: student.Ma_Sinh_Vien,
            gpa: student.GPA,
            sum_credits: Number(student.Tong_Tin_Chi),
            drl: drlMap[student.Ma_Sinh_Vien] || 0
        }));

        return {
            students: studentsWithDrl,
            semesters: semesterData,
            drl: drlData,
            soDatNgoaiNgu: soDatNgoaiNguData,
            gioiTinh: gioiTinhData
        };
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu GPA:", error);
        alert("Lỗi khi tải dữ liệu: " + error.message);
        return { students: [], semesters: [], drl: [] };
    }
};

const fetchGPADataChart = async () => {
    const token = localStorage.getItem("token");
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
    const url = `/thongkesv/api?${params.toString()}`;

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
            drlMap[item.Ma_Sinh_Vien] = parseFloat(item.Diem_Ren_Luyen) || 0;
        });

        const studentsWithDrl = sinhVienList.map(student => ({
            name: student.Ma_Sinh_Vien,
            gpa: student.GPA,
            sum_credits: Number(student.Tong_Tin_Chi),
            drl: drlMap[student.Ma_Sinh_Vien] || 0
        }));

        return {
            students: studentsWithDrl,
            semesters: semesterData,
            drl: drlData
        };
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu GPA:", error);
        alert("Lỗi khi tải dữ liệu: " + error.message);
        return { students: [], semesters: [], drl: [] };
    }
};

//Hàm phân bổ sv theo GPA 
const categorizeGPA = (gpaList) => {
    let distribution = { excellent: 0, good: 0, fair: 0, average_good: 0, average: 0, weak: 0, poor: 0 };

    gpaList.forEach(student => {
        if (student.gpa >= 9.0) distribution.excellent++;
        else if (student.gpa >= 8) distribution.good++;
        else if (student.gpa >= 7) distribution.fair++;
        else if (student.gpa >= 6) distribution.average_good++;
        else if (student.gpa >= 5) distribution.average++;
        else if (student.gpa >= 4) distribution.weak++;
        else distribution.poor++;
    });

    return distribution;
};
//Hàm phân bổ sv theo DRL 
const categorizeDRL = (students) => {
    let distribution = { excellent: 0, good: 0, fair: 0, average_good: 0, average: 0, weak: 0, poor: 0 };

    students.forEach(student => {
        if (student.drl >= 90) distribution.excellent++;
        else if (student.drl >= 80) distribution.good++;
        else if (student.drl >= 70) distribution.fair++;
        else if (student.drl >= 60) distribution.average_good++;
        else if (student.drl >= 50) distribution.average++;
        else if (student.drl >= 40) distribution.weak++;
        else distribution.poor++;
    });

    return distribution;
};
//Hàm phân loại GPA
const getGPAClassification = (gpa) => {
    if (gpa >= 9.0) return 'excellent';
    if (gpa >= 8.0) return 'good';
    if (gpa >= 7.0) return 'fair';
    if (gpa >= 6.0) return 'average_good';
    if (gpa >= 5.0) return 'average';
    if (gpa >= 4.0) return 'weak';
    return 'poor';
};
//Hàm phân loại tín chỉ
const getCreditClassification = (credits) => {
    if (credits < 14) return 'under14';
    return 'normal';
};
//Hàm phân loại DRLDRL
const getDRLClassification = (drl) => {
    if (drl >= 90) return 'excellent';
    if (drl >= 80) return 'good';
    if (drl >= 70) return 'fair';
    if (drl >= 60) return 'average_good';
    if (drl >= 50) return 'average';
    if (drl >= 40) return 'weak';
    return 'poor';
};

// Hàm cập nhật thống kê
const updateStats = (students) => {
    const totalStudents = students.length;
    const totalGPA = students.reduce((sum, student) => sum + parseFloat(student.gpa || 0), 0);
    const totalCredits = students.reduce((sum, student) => sum + (parseFloat(student.sum_credits) || 0), 0);
    const studentsWithDrl = students.filter(student => parseFloat(student.drl) > 0);
    const totalDrl = studentsWithDrl.reduce((sum, student) => sum + parseFloat(student.drl || 0), 0);
    const drlCount = studentsWithDrl.length;

    const avgGPA = totalStudents > 0 ? (totalGPA / totalStudents).toFixed(2) : 0;
    const avgCredits = totalStudents > 0 ? (totalCredits / totalStudents).toFixed(2) : 0;
    const avgDrl = drlCount > 0 ? (totalDrl / drlCount).toFixed(2) : 0;

    document.getElementById("total-students").textContent = totalStudents;
    document.getElementById("average-gpa").textContent = avgGPA;
    document.getElementById("average-credits").textContent = avgCredits;
    document.getElementById("average-drl").textContent = avgDrl || "0";
};

// Hàm render số liệu thống kê
const renderStats = async () => {
    const { students, soDatNgoaiNgu, gioiTinh } = await fetchGPAData();
    updateStats(students);
    document.getElementById("total-students-pass-english").textContent = soDatNgoaiNgu;

    const gioiTinhElement = document.getElementById("gender");
    if (gioiTinhElement) {
        const nam = gioiTinh?.Nam || 0;
        const nu = gioiTinh?.Nu || 0;
        gioiTinhElement.textContent = `${nam}/${nu}`;
    }
};

const fetchFilteredGPAData = async (semesterParam, yearParam) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/login.html";
        return;
    }

    const params = new URLSearchParams();
    if (semesterParam) params.append("hocKy", semesterParam);
    if (yearParam) params.append("namHoc", yearParam);
    const url = `/thongkesv/api?${params.toString()}`;

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
    const sinhVienList = data.query;
    const drlData = data.drlData || [];

    const drlMap = {};
    drlData.forEach(item => {
        drlMap[item.Ma_Sinh_Vien] = parseFloat(item.Diem_Ren_Luyen) || 0;
    });

    const studentsWithDrl = sinhVienList.map(student => ({
        name: student.Ma_Sinh_Vien,
        gpa: student.GPA,
        sum_credits: Number(student.Tong_Tin_Chi),
        drl: drlMap[student.Ma_Sinh_Vien] || 0
    }));

    return { students: studentsWithDrl };
};

// Biến cho vẽ biểu đồ
let pieChartInstance;
let GPAlineChartInstance;
let drlPieChartInstance;
let DRLlineChartInstance;

const renderCharts = async () => {
    const { students, semesters } = await fetchGPADataChart();

    if (students.length === 0) {
        console.warn("Không có dữ liệu GPA để hiển thị.");
        if (pieChartInstance) {
            pieChartInstance.destroy();
            pieChartInstance = null;
        }
        if (GPAlineChartInstance) {
            GPAlineChartInstance.destroy();
            GPAlineChartInstance = null;
        }
        if (drlPieChartInstance) {
            drlPieChartInstance.destroy();
            drlPieChartInstance = null;
        }
        if (DRLlineChartInstance) {
            DRLlineChartInstance.destroy();
            DRLlineChartInstance = null;
        }
        return;
    }

    if (GPAlineChartInstance) GPAlineChartInstance.destroy();
    if (DRLlineChartInstance) DRLlineChartInstance.destroy();
    console.log("📘 Semesters nhận được:", semesters);

    const sortedSemesters = [...semesters].sort((a, b) => a.Hoc_Ky - b.Hoc_Ky);

    const semesterLabels = sortedSemesters.map(sem => `HK${sem.Hoc_Ky}`);
    const semesterGPAs = sortedSemesters.map(sem => sem.GPA_Trung_Binh);
    const semesterDRLs = sortedSemesters.map(sem => sem.DRL_Trung_Binh);

    GPAlineChartInstance = new Chart(document.getElementById("GPAlineChart"), {
        type: "line",
        data: {
            labels: semesterLabels.length > 0 ? semesterLabels : ['Không có dữ liệu'],
            datasets: [{
                label: "GPA theo học kỳ",
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                borderColor: "#1C6DD0",
                data: semesterGPAs.length > 0 ? semesterGPAs : [0],
                fill: true,
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
                y: { beginAtZero: true, max: 10, title: { display: true, text: 'GPA' } },
                x: { title: { display: true, text: 'Học kỳ' } }
            }
        }
    });

    document.getElementById("GPAlineChart").addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Vui lòng đăng nhập.");

        // Tự động lấy học kỳ mới nhất từ sortedSemesters
        const latestSemester = sortedSemesters[sortedSemesters.length - 1];
        const currentSemester = latestSemester?.Hoc_Ky?.toString();

        if (!currentSemester) {
            return alert("Không tìm thấy học kỳ mới nhất để so sánh.");
        }

        const prevSemester = currentSemester === "2" ? "1" : "2";

        try {
            const [prevData, currentData] = await Promise.all([
                fetchFilteredGPAData(prevSemester, null),
                fetchFilteredGPAData(currentSemester, null),
            ]);

            const prevMap = {};
            prevData.students.forEach(sv => prevMap[sv.name] = sv.gpa);

            const tableBody = document.getElementById("compare-gpa-body");
            tableBody.innerHTML = "";

            currentData.students.forEach((sv, idx) => {
                const prevGPA = parseFloat(prevMap[sv.name] || 0).toFixed(2);
                const currGPA = parseFloat(sv.gpa || 0).toFixed(2);
                const diff = (currGPA - prevGPA).toFixed(2);
                const diffText = diff > 0 ? `+${diff}` : diff;

            const bgColor = parseFloat(diff) > 0
                ?'rgb(141, 236, 193)'  // xanh nhạt
                : parseFloat(diff) < 0
                    ? 'rgb(255, 154, 163)'  // đỏ nhạt
                    : '';

            const row = `
                <tr>
                    <td style="background-color: ${bgColor}">${idx + 1}</td>
                    <td style="background-color: ${bgColor}">${sv.name}</td>
                    <td style="background-color: ${bgColor}">${prevGPA}</td>
                    <td style="background-color: ${bgColor}">${currGPA}</td>
                    <td style="background-color: ${bgColor}">${diffText}</td>
                    <td style="background-color: ${bgColor}"><button class="btn btn-sm btn-primary" onclick="viewStudentProfile('${sv.name}')">Xem</button></td>
                </tr>`;



                tableBody.innerHTML += row;
            });

            const modal = new bootstrap.Modal(document.getElementById('compareGpaModal'));
            modal.show();

        } catch (error) {
            console.error("Lỗi khi so sánh GPA:", error);
            alert("Không thể lấy dữ liệu GPA để so sánh.");
        }
    });


    DRLlineChartInstance = new Chart(document.getElementById("DRLlineChart"), {
        type: "line",
        data: {
            labels: semesterLabels.length > 0 ? semesterLabels : ['Không có dữ liệu'],
            datasets: [{
                label: "DRL theo học kỳ",
                backgroundColor: 'rgba(70, 229, 78, 0.1)',
                borderWidth: 2,
                borderColor: "#00FF00",
                data: semesterDRLs.length > 0 ? semesterDRLs : [0],
                fill: true,
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
                            return `DRL: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, max: 100, title: { display: true, text: 'DRL' } },
                x: { title: { display: true, text: 'Học kỳ' } }
            }
        }
    });

    const gpaDistribution = categorizeGPA(students);
    const totalStudents = students.length;

    if (totalStudents === 0) {
        console.warn("Không có dữ liệu GPA để phân loại.");
        return;
    }

    const percentageData = Object.values(gpaDistribution).map(value => ((value / totalStudents) * 100).toFixed(2));

    if (pieChartInstance) pieChartInstance.destroy();

    pieChartInstance = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: [
                `Xuất sắc (${percentageData[0]}%)`,
                `Giỏi (${percentageData[1]}%)`,
                `Khá (${percentageData[2]}%)`,
                `Trung bình khá (${percentageData[3]}%)`,
                `Trung bình (${percentageData[4]}%)`,
                `Yếu (${percentageData[5]}%)`,
                `Kém (${percentageData[6]}%)`
            ],
            datasets: [{
                backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF9800", "#9C27B0", "#F44336", "#B71C1C"],
                data: percentageData
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
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
        const percentageData = Object.values(drlDistribution).map(value => ((value / totalStudentsWithDrl) * 100).toFixed(2));

        if (drlPieChartInstance) drlPieChartInstance.destroy();

        const drlChartElement = document.getElementById("drlChart");
        if (drlChartElement) {
            drlPieChartInstance = new Chart(drlChartElement, {
                type: "pie",
                data: {
                    labels: [
                        `Xuất sắc (${percentageData[0]}%)`,
                        `Giỏi (${percentageData[1]}%)`,
                        `Khá (${percentageData[2]}%)`,
                        `Trung bình khá (${percentageData[3]}%)`,
                        `Trung bình (${percentageData[4]}%)`,
                        `Yếu (${percentageData[5]}%)`,
                        `Kém (${percentageData[6]}%)`
                    ],
                    datasets: [{
                        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF9800", "#9C27B0", "#F44336", "#B71C1C"],
                        data: percentageData
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
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

// Modal DSSV
document.addEventListener("DOMContentLoaded", function () {
    const studentListModal = document.getElementById("studentListModal");

    studentListModal.addEventListener("show.bs.modal", async () => {
        const token = localStorage.getItem("token");
        const tableBody = document.getElementById('student-list-body');
        tableBody.innerHTML = '';

        try {
            const res = await fetch("/dssv/api", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                data.forEach((sv, index) => {
                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${sv.Ma_Sinh_Vien}</td>
                            <td>${sv.Ho_Ten}</td>
                            <td>${sv.Chung_Chi_Anh_Van}</td>
                            <td>${sv.Gioi_Tinh}</td>
                            <td><button onclick="viewStudentProfile('${sv.Ma_Sinh_Vien}')" class="btn btn-primary btn-sm">Xem</button></td>
                        </tr>`;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="4">Không có sinh viên nào.</td></tr>`;
            }
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="4">Lỗi khi tải dữ liệu!</td></tr>`;
            console.error("Lỗi:", error);
        }
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
});

// Modal dssv theo gpa
document.addEventListener("DOMContentLoaded", function () {
    const studentAVEListModal = document.getElementById("studentAVEListModal");

    studentAVEListModal.addEventListener("show.bs.modal", async () => {
        const token = localStorage.getItem("token");
        const tableBody = document.getElementById('student-ave-list-body');
        tableBody.innerHTML = '<tr><td colspan="5">Đang tải dữ liệu...</td></tr>';

        try {
            const { students } = await fetchGPAData();
            tableBody.innerHTML = '';

            if (Array.isArray(students) && students.length > 0) {
                students.forEach((student, index) => {
                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${student.name}</td>
                            <td>${parseFloat(student.gpa).toFixed(2)}</td>
                            <td>${parseFloat(student.sum_credits).toFixed(2)}</td>
                            <td>${parseFloat(student.drl).toFixed(2)}</td>
                            <td><button onclick="viewStudentProfile('${student.name}')" class="btn btn-primary btn-sm">Xem</button></td>
                        </tr>`;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="5">Không có dữ liệu GPA.</td></tr>`;
            }
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="5">Lỗi khi tải dữ liệu GPA!</td></tr>`;
            console.error("Lỗi:", error);
        }
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
});

// Filter dssv
document.getElementById("filter-btn-student").addEventListener("click", function () {
    const mssv = document.getElementById("filterMSSV").value.toLowerCase();
    const name = document.getElementById("filterName").value.toLowerCase();
    const english = document.getElementById("filterEnglish").value;
    const gender = document.getElementById("filterGender").value;

    const rows = document.querySelectorAll("#student-list-body tr");
    let stt = 1;

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowMSSV = cells[1]?.textContent.toLowerCase() || "";
        const rowName = cells[2]?.textContent.toLowerCase() || "";
        const rowEnglish = cells[3]?.textContent || "";
        const rowGender = cells[4]?.textContent || "";

        const matchMSSV = rowMSSV.includes(mssv);
        const matchName = rowName.includes(name);
        const matchEnglish = !english || rowEnglish === english;
        const matchGender = !gender || rowGender === gender;

        if (matchMSSV && matchName && matchEnglish && matchGender) {
            row.style.display = "";
            cells[0].textContent = stt++;
        } else {
            row.style.display = "none";
        }
    });
});

// Reset fillter
document.getElementById("reset-btn-student").addEventListener("click", function () {
    document.getElementById("filterMSSV").value = "";
    document.getElementById("filterName").value = "";
    document.getElementById("filterEnglish").value = "";
    document.getElementById("filterGender").value = "";
    const rows = document.querySelectorAll("#student-list-body tr");
    let stt = 1;
    rows.forEach(row => {
        row.style.display = "";
        row.querySelectorAll("td")[0].textContent = stt++;
    });
});

// Filter 
document.getElementById("filter-btn-student-ave").addEventListener("click", async function () {
    const mssv = document.getElementById("filterMSSV-ave").value.toLowerCase();
    const semester = document.getElementById("semester-filter-modal").value;
    const year = document.getElementById("year-filter-modal").value;
    const gpaClassification = document.getElementById("gpa-classification-filter").value;
    const creditClassification = document.getElementById("credit-classification-filter").value;
    const drlClassification = document.getElementById("drl-classification-filter").value;

    if (semester || year) {
        const tableBody = document.getElementById('student-ave-list-body');
        tableBody.innerHTML = '<tr><td colspan="6">Đang lọc dữ liệu...</td></tr>';

        try {
            

            const { students } = await fetchFilteredGPAData(semester, year);
            let filteredStudents = students;

            if (mssv) {
                filteredStudents = students.filter(student => student.name.toLowerCase().includes(mssv));
            }
            if (gpaClassification) {
                filteredStudents = filteredStudents.filter(student => getGPAClassification(parseFloat(student.gpa)) === gpaClassification);
            }
            if (creditClassification) {
                filteredStudents = filteredStudents.filter(student => getCreditClassification(parseFloat(student.sum_credits)) === creditClassification);
            }
            if (drlClassification) {
                filteredStudents = filteredStudents.filter(student => getDRLClassification(parseFloat(student.drl)) === drlClassification);
            }

            tableBody.innerHTML = '';
            filteredStudents.forEach((student, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.name}</td>
                        <td>${parseFloat(student.gpa).toFixed(2)}</td>
                        <td>${parseFloat(student.sum_credits).toFixed(2)}</td>
                        <td>${parseFloat(student.drl).toFixed(2)}</td>
                        <td><button onclick="viewStudentProfile('${student.name}')" class="btn btn-primary btn-sm">Xem</button></td>
                    </tr>`;
                tableBody.innerHTML += row;
            });

            if (filteredStudents.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6">Không tìm thấy dữ liệu phù hợp.</td></tr>`;
            }
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="6">Lỗi khi lọc dữ liệu!</td></tr>`;
            console.error("Lỗi:", error);
        }
    } else {
        const rows = document.querySelectorAll("#student-ave-list-body tr");
        let stt = 1;

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 6) return;

            const rowMSSV = cells[1]?.textContent.toLowerCase() || "";
            const rowGPA = parseFloat(cells[2]?.textContent) || 0;
            const rowCredits = parseFloat(cells[3]?.textContent) || 0;
            const rowDRL = parseFloat(cells[4]?.textContent) || 0;

            const matchMSSV = rowMSSV.includes(mssv);
            const matchGPAClass = gpaClassification ? getGPAClassification(rowGPA) === gpaClassification : true;
            const matchCreditClass = creditClassification ? getCreditClassification(rowCredits) === creditClassification : true;
            const matchDRLClass = drlClassification ? getDRLClassification(rowDRL) === drlClassification : true;

            if (matchMSSV && matchGPAClass && matchCreditClass && matchDRLClass) {
                row.style.display = "";
                cells[0].textContent = stt++;
            } else {
                row.style.display = "none";
            }
        });
    }
});

// Reset dssv theo gpa
document.getElementById("reset-btn-student-ave").addEventListener("click", function () {
    document.getElementById("filterMSSV-ave").value = "";
    document.getElementById("semester-filter-modal").value = "";
    document.getElementById("year-filter-modal").value = "";
    document.getElementById("gpa-classification-filter").value = "";
    document.getElementById("credit-classification-filter").value = "";
    document.getElementById("drl-classification-filter").value = "";

    const rows = document.querySelectorAll("#student-ave-list-body tr");
    let stt = 1;
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 6) {
            row.style.display = "";
            cells[0].textContent = stt++;
        }
    });
});

// Hàm xem hồ sơ sinh viên
function viewStudentProfile(mssv) {
    const token = localStorage.getItem("token");
    if (!token || !mssv) {
        alert("Vui lòng đăng nhập lại!");
        window.location.href = "/login";
        return;
    }
    // Kiểm tra MSSV hợp lệ
    if (!/^\d{8,10}$/.test(mssv)) {
        alert("MSSV không hợp lệ!");
        return;
    }

    // Lưu thông tin vào storage
    localStorage.setItem('viewingStudentMSSV', mssv);
    sessionStorage.setItem('currentStudentMSSV', mssv);
    sessionStorage.setItem('currentStudentToken', token);

    // Chuyển trang
    window.location.href = '/completedCourses/KetQuaHocTap';
}
// Code khởi tạo sự kiện khi DOM loaded.
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
