async function fetchTeacherProfile() {
    try {
        let token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Không tìm thấy token!");
            return;
        }
        console.log("🎯 Token trong localStorage:", token);
        const response = await fetch("http://localhost:3000/teacher/api", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log("📩 Headers gửi đi:", response.headers);
        let data = await response.json();
        if (response.ok) {
            console.log("✅ Thông tin giảng viên:", data);
        } else
            console.error("❌ Lỗi khi lấy dữ liệu:", data.message);
    }
    catch(error) {
        console.error("❌ Lỗi khi gọi API:", error);
    }
}

fetchTeacherProfile();