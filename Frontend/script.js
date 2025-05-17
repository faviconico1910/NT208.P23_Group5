// xử lý đăng nhập thường
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
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
        document.cookie = `token=${data.token}; path=/; max-age=3600`; // 1 giờ

        // Điều hướng dựa vào Vai_Tro
        if (data.Vai_Tro === "SinhVien") {
            window.location.href = `/student/profile`;
        } else if (data.Vai_Tro === "GiangVien") {
            window.location.href = `/teacher/${data.Tai_Khoan}`;
        }
        else if (data.Vai_Tro=="admin") {
           window.location.href = "/admin";
        }
    } else {
        alert("Error:"+ data.message);
    }
    
});

// xử lý nút đăng nhập bằng google
document.getElementById("google-btn").onclick = () => {
  window.location.href = "http://localhost:3000/login/auth/google";
};

window.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const Vai_Tro = params.get("Vai_Tro");
    const Tai_Khoan = params.get("Tai_Khoan");
    const error = params.get("error");
    if (error === "oauth") {
        alert("Đăng nhập Google thất bại. Vui lòng thử lại hoặc dùng tài khoản hợp lệ!");
    }
    if (token) {
        localStorage.setItem("token", token);
        if (Vai_Tro) localStorage.setItem("Vai_Tro", Vai_Tro);
        if (Tai_Khoan) localStorage.setItem("Tai_Khoan", Tai_Khoan);

        // Điều hướng dựa vào Vai_Tro
        if (Vai_Tro === "SinhVien") {
            window.location.href = `/student/profile`;
        } else if (Vai_Tro === "GiangVien") {
            window.location.href = `/teacher/${Tai_Khoan}`;
        } else if (Vai_Tro === "admin") {
            window.location.href = "/admin";
        } else {
            window.location.href = "/";
        }
    }
});
