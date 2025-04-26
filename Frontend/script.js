document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log('♥ Submitted!!!');
    let Tai_Khoan = document.getElementById("Tai_Khoan").value;
    let Mat_Khau = document.getElementById("Mat_Khau").value;

    let response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Tai_Khoan, Mat_Khau })
    });

    let data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("Vai_Tro", data.Vai_Tro); // Lưu Vai_Tro
        localStorage.setItem("Tai_Khoan", data.Tai_Khoan);

        // Điều hướng dựa vào Vai_Tro
        if (data.Vai_Tro === "SinhVien") {
            window.location.href = `/KetQuaHocTap/completedCourses.html`;
        } else if (data.Vai_Tro === "GiangVien") {
            window.location.href = `/teacher/${data.Tai_Khoan}`;
        }
    } else {
        alert( data.message);
    }
});
