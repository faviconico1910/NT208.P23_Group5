document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const userListBody = document.getElementById('user-list-body');
    const searchUserForm = document.getElementById('search-user-form');
    const searchUsernameInput = document.getElementById('search-username');
    const editUserModal = document.getElementById('editUserModal');
    const editUserForm = document.getElementById('editUserForm');
    const editUsernameInput = document.getElementById('edit-username');
    const editPasswordInput = document.getElementById('edit-password');
    const editConfirmPasswordInput = document.getElementById('edit-confirm-password');

    let allUsers = []; // Lưu trữ tất cả người dùng để tìm kiếm

    // Hàm lấy danh sách người dùng
    async function fetchUsers() {
        try {
            const response = await fetch('/mnguser/users', { 
                method: 'GET',  
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                allUsers = result.data;
                displayUsers(allUsers);
            } else {
                alert(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            alert('Không thể lấy danh sách người dùng');
        }
    }

    // Hàm hiển thị danh sách người dùng
    function displayUsers(users) {
        userListBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.Tai_Khoan}</td>
                <td>${user.Vai_Tro}</td>
                <td class="action-btns">
                    <button class="edit-btn" data-username="${user.Tai_Khoan}">Sửa</button>
                    <button class="delete-btn" data-username="${user.Tai_Khoan}">Xóa</button>
                </td>
            `;
            userListBody.appendChild(row);
        });

        // Thêm event listener cho nút sửa và xóa
        addEventListenersToButtons();
    }

    // Hàm thêm event listener cho nút sửa và xóa
    function addEventListenersToButtons() {
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const username = button.dataset.username;
                openEditModal(username);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const username = button.dataset.username;
                deleteUser(username);
            });
        });
    }

    // Hàm mở modal chỉnh sửa
    function openEditModal(username) {
        editUsernameInput.value = username;
        editUserModal.style.display = 'block';
    }

    // Hàm đóng modal chỉnh sửa
    function closeEditModal() {
        editUserModal.style.display = 'none';
    }

    // Xử lý submit form chỉnh sửa
    editUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = editUsernameInput.value;
        const password = editPasswordInput.value;
        const confirmPassword = editConfirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }

        try {
            const response = await fetch(`/mnguser/users/${username}`, { // Endpoint sửa user
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            const result = await response.json();

            if (result.success) {
                alert('Cập nhật thành công!');
                closeEditModal();
                fetchUsers(); // Refresh danh sách
            } else {
                alert(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            alert('Đã xảy ra lỗi khi cập nhật');
        }
    });

    // Xử lý xóa người dùng
    async function deleteUser(username) {
        if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${username}?`)) {
            try {
                const response = await fetch(`/mnguser/users/${username}`, { // Endpoint xóa user
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    alert('Xóa thành công!');
                    fetchUsers(); // Refresh danh sách
                } else {
                    alert(`Lỗi: ${result.message}`);
                }
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                alert('Đã xảy ra lỗi khi xóa');
            }
        }
    }

    // Xử lý tìm kiếm
    searchUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchUsernameInput.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => user.Tai_Khoan.toLowerCase().includes(searchTerm));
        displayUsers(filteredUsers);
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === editUserModal) {
            closeEditModal();
        }
    });

    // Đóng modal khi click nút X
    editUserModal.querySelector('.close-btn').addEventListener('click', closeEditModal);

    // Initial fetch
    fetchUsers();
});