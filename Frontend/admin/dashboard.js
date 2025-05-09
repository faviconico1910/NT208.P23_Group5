document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Hàm lấy thống kê từ server
    async function fetchSystemStats() {
        try {
            console.log('Đang gọi API /admin/stats...');
            const response = await fetch('/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Kết quả trả về:', response);
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('Dữ liệu nhận được:', result);
            
            if (result.success) {
                updateStatsUI(result.data);
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            console.error('Lỗi khi lấy thống kê:', error);
            showError(error.message);
        }
    }

    // Cập nhật UI với dữ liệu từ server
    function updateStatsUI(stats) {
        console.log('Đang cập nhật UI với:', stats);
        
        // Cập nhật từng thẻ stat
        document.getElementById('total-students').textContent = stats.totalStudents || 0;
        document.getElementById('total-teachers').textContent = stats.totalTeachers || 0;
        document.getElementById('total-courses').textContent = stats.totalCourses || 0;
        document.getElementById('total-classes').textContent = stats.totalClasses || 0;
        
        // Thêm hiệu ứng
        animateStatsUpdate();
    }

    // Hiệu ứng cập nhật
    function animateStatsUpdate() {
        const statValues = document.querySelectorAll('.stat-card p');
        statValues.forEach(p => {
            p.style.transition = 'all 0.3s ease';
            p.style.transform = 'scale(1.1)';
            setTimeout(() => {
                p.style.transform = 'scale(1)';
            }, 300);
        });
    }

    // Hiển thị lỗi
    function showError(message) {
        const statValues = document.querySelectorAll('.stat-card p');
        statValues.forEach(p => {
            p.textContent = '!Lỗi';
            p.style.color = 'red';
        });
        
        // Có thể thêm thông báo lỗi trực quan
        alert(`Lỗi: ${message}`);
    }

    // Gọi hàm lấy dữ liệu
    fetchSystemStats();


    // Test cơ bản khi trang load
console.log('Kiểm tra cơ bản:');
console.log('Token:', token);
console.log('Tìm thấy phần tử total-students:', document.getElementById('total-students'));
console.log('Tìm thấy phần tử total-teachers:', document.getElementById('total-teachers'));



// Xử lý nút "Thêm người dùng mới"------------------------------------
const addUserBtn = document.querySelector('.btn-primary:first-child');
const addUserModal = document.getElementById('addUserModal');
const closeBtn = document.querySelector('.close-btn');
const addUserForm = document.getElementById('addUserForm');
// Mở modal
addUserBtn.addEventListener('click', () => {
    addUserModal.style.display = 'block';
});

// Đóng modal khi click nút X
closeBtn.addEventListener('click', () => {
    addUserModal.style.display = 'none';
});

// Đóng modal khi click bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === addUserModal) {
        addUserModal.style.display = 'none';
    }
});
// Xử lý submit form
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userType = document.getElementById('userType').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
    }
    try {
        const response = await fetch('/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userType,
                username,
                password
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Thêm người dùng thành công!');
            addUserModal.style.display = 'none';
            addUserForm.reset();
            
            // Cập nhật lại thống kê
            fetchSystemStats();
        } else {
            alert(`Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error('Lỗi khi thêm người dùng:', error);
        alert('Đã xảy ra lỗi khi thêm người dùng');
    }
});



// Xử lý nút "Tạo lớp học mới"------------------------------------
const addClassBtn = document.querySelector('.btn-primary:nth-child(2)');
const addClassModal = document.getElementById('addClassModal');
const addClassForm = document.getElementById('addClassForm');

// Mở modal
addClassBtn.addEventListener('click', () => {
    addClassModal.style.display = 'block';
});

// Đóng modal khi click nút X
addClassModal.querySelector('.close-btn').addEventListener('click', () => {
    addClassModal.style.display = 'none';
});

// Đóng modal khi click bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === addClassModal) {
        addClassModal.style.display = 'none';
    }
});

// Xử lý submit form
addClassForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const classCode = document.getElementById('classCode').value;
    const className = document.getElementById('className').value;
    const classSize = document.getElementById('classSize').value;
    const classAdvisor = document.getElementById('classAdvisor').value;

    try {
        const response = await fetch('/admin/classes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                Ma_Lop: classCode,
                Ten_Lop: className,
                So_Luong: classSize,
                Co_Van_Hoc_Tap: classAdvisor
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Tạo lớp học thành công!');
            addClassModal.style.display = 'none';
            addClassForm.reset();
            
            // Cập nhật lại thống kê
            fetchSystemStats();
        } else {
            alert(`Lỗi: ${result.message}`);
        }
    } catch (error) {
        console.error('Lỗi khi tạo lớp học:', error);
        alert('Đã xảy ra lỗi khi tạo lớp học');
    }
});
});