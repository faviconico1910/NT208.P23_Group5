document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập nếu không có token
        return;
    }

    // Lấy các phần tử DOM
    const classListBody = document.getElementById('class-list-body');
    const searchClassForm = document.getElementById('search-class-form');
    const searchClassNameInput = document.getElementById('search-class-name');
    const addClassBtn = document.getElementById('add-class-btn');

    const editClassModal = document.getElementById('editClassModal');
    const editClassForm = document.getElementById('editClassForm');
    const editClassIdInput = document.getElementById('edit-class-id'); 
    const editClassNameInput = document.getElementById('edit-class-name');
    const editClassQuantityInput = document.getElementById('edit-class-quantity');
    const editClassAdvisorInput = document.getElementById('edit-class-advisor');

    const addClassModal = document.getElementById('addClassModal');
    const addClassForm = document.getElementById('addClassForm');
    const addClassIdInput = document.getElementById('add-class-id');
    const addClassNameInput = document.getElementById('add-class-name');
    const addClassQuantityInput = document.getElementById('add-class-quantity');
    const addClassAdvisorInput = document.getElementById('add-class-advisor');

    const addStudentModal = document.getElementById('addStudentModal');
    const addStudentForm = document.getElementById('addStudentForm');
    const addStudentClassIdInput = document.getElementById('add-student-class-id');
    const studentUsernameInput = document.getElementById('student-username');

    let allClasses = []; // Lưu trữ tất cả lớp học để tìm kiếm

    // Hàm lấy danh sách lớp học
    async function fetchClasses() {
        try {
            const response = await fetch('/mnglop/classes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                // Nếu response không OK (ví dụ: 401 Unauthorized), xử lý chuyển hướng hoặc thông báo lỗi
                if (response.status === 401 || response.status === 403) {
                    alert('Phiên làm việc đã hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                allClasses = result.data;
                displayClasses(allClasses);
            } else {
                alert(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách lớp học:', error);
            alert('Không thể lấy danh sách lớp học');
        }
    }

    // Hàm hiển thị danh sách lớp học
    function displayClasses(classes) {
        if (!classListBody) return; // Đảm bảo element tồn tại
        classListBody.innerHTML = '';
        classes.forEach(lop => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lop.Ma_Lop}</td>
                <td>${lop.Ten_Lop}</td>
                <td>${lop.So_Luong_Hien_Tai || 0}/${lop.So_Luong}</td>
                <td>${lop.Co_Van_Hoc_Tap}</td>
                <td class="action-btns">
                    <button class="edit-btn" data-id="${lop.Ma_Lop}">Sửa</button>
                    <button class="delete-btn" data-id="${lop.Ma_Lop}">Xóa</button>
                    <button class="add-student-btn" data-id="${lop.Ma_Lop}" data-current-quantity="${lop.So_Luong_Hien_Tai || 0}" data-max-quantity="${lop.So_Luong}">Thêm SV</button>
                </td>
            `;
            classListBody.appendChild(row);
        });

        addEventListenersToButtons(); // Gọi hàm này sau khi render lại bảng
    }

    // Hàm thêm event listener cho nút sửa, xóa và thêm sinh viên
    function addEventListenersToButtons() {
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const addStudentButtons = document.querySelectorAll('.add-student-btn');

        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const classId = button.dataset.id;
                const lop = allClasses.find(l => l.Ma_Lop === classId);
                if (lop) {
                    openEditModal(lop);
                }
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const classId = button.dataset.id;
                deleteClass(classId);
            });
        });

        addStudentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const classId = button.dataset.id;
                const currentQuantity = parseInt(button.dataset.currentQuantity);
                const maxQuantity = parseInt(button.dataset.maxQuantity);
                openAddStudentModal(classId, currentQuantity, maxQuantity);
            });
        });
    }

    // Hàm mở modal chỉnh sửa lớp
    function openEditModal(lop) {
    if (!editClassModal || !editClassIdInput || !editClassNameInput || !editClassQuantityInput || !editClassAdvisorInput) return;
    editClassIdInput.value = lop.Ma_Lop; // Gán mã lớp vào input có id là 'edit-class-id'
    editClassNameInput.value = lop.Ten_Lop;
    editClassQuantityInput.value = lop.So_Luong;
    editClassAdvisorInput.value = lop.Co_Van_Hoc_Tap;
    editClassModal.style.display = 'block';
}

    // Hàm đóng modal chỉnh sửa
    function closeEditModal() {
        if (editClassModal) {
            editClassModal.style.display = 'none';
        }
    }

    // Xử lý submit form chỉnh sửa lớp
   if (editClassForm) {
    editClassForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const classId = editClassIdInput.value; // Lấy mã lớp từ input đã hiển thị
        const className = editClassNameInput.value;
        const classQuantity = parseInt(editClassQuantityInput.value);
        const classAdvisor = editClassAdvisorInput.value;

            if (classQuantity < 1) {
                alert('Số lượng sinh viên tối đa phải lớn hơn 0.');
                return;
            }

            try {
                const response = await fetch(`/mnglop/classes/${classId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        Ten_Lop: className,
                        So_Luong: classQuantity,
                        Co_Van_Hoc_Tap: classAdvisor
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Cập nhật lớp học thành công!');
                    closeEditModal();
                    fetchClasses(); // Refresh danh sách
                } else {
                    alert(`Lỗi: ${result.message}`);
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật lớp học:', error);
                alert('Đã xảy ra lỗi khi cập nhật lớp học');
            }
        });
    }

    // Xử lý xóa lớp học
    async function deleteClass(classId) {
        if (confirm(`Bạn có chắc chắn muốn xóa lớp học ${classId} không? (Lưu ý: Bạn chỉ có thể xóa lớp nếu không có sinh viên nào trong lớp)`)) {
            try {
                const response = await fetch(`/mnglop/classes/${classId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Xóa lớp học thành công!');
                    fetchClasses(); // Refresh danh sách
                } else {
                    alert(`Lỗi: ${result.message}`);
                }
            } catch (error) {
                console.error('Lỗi khi xóa lớp học:', error);
                alert('Đã xảy ra lỗi khi xóa lớp học');
            }
        }
    }

    // Xử lý tìm kiếm lớp học
    if (searchClassForm) {
        searchClassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchClassNameInput.value.toLowerCase();
            const filteredClasses = allClasses.filter(lop => 
                (lop.Ten_Lop && lop.Ten_Lop.toLowerCase().includes(searchTerm)) || 
                (lop.Ma_Lop && lop.Ma_Lop.toLowerCase().includes(searchTerm))
            );
            displayClasses(filteredClasses);
        });
    }

    // Mở modal thêm lớp mới
    if (addClassBtn) {
        addClassBtn.addEventListener('click', () => {
            if (addClassForm) addClassForm.reset();
            if (addClassModal) addClassModal.style.display = 'block';
        });
    }

    // Đóng modal khi click nút X
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === editClassModal) {
            closeEditModal();
        }
        if (e.target === addClassModal) {
            addClassModal.style.display = 'none';
        }
        if (e.target === addStudentModal) {
            addStudentModal.style.display = 'none';
        }
    });

    // Xử lý submit form thêm lớp mới
    if (addClassForm) {
        addClassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const classId = addClassIdInput.value;
            const className = addClassNameInput.value;
            const classQuantity = parseInt(addClassQuantityInput.value);
            const classAdvisor = addClassAdvisorInput.value;

            if (classQuantity < 1) {
                alert('Số lượng sinh viên tối đa phải lớn hơn 0.');
                return;
            }

            try {
                const response = await fetch('/mnglop/classes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        Ma_Lop: classId,
                        Ten_Lop: className,
                        So_Luong: classQuantity,
                        Co_Van_Hoc_Tap: classAdvisor
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Thêm lớp học thành công!');
                    if (addClassModal) addClassModal.style.display = 'none';
                    fetchClasses(); // Refresh danh sách
                } else {
                    alert(`Lỗi: ${result.message}`);
                }
            } catch (error) {
                console.error('Lỗi khi thêm lớp học:', error);
                alert('Đã xảy ra lỗi khi thêm lớp học');
            }
        });
    }

    // Hàm mở modal thêm sinh viên
    function openAddStudentModal(classId, currentQuantity, maxQuantity) {
        if (currentQuantity >= maxQuantity) {
            alert(`Lớp học ${classId} đã đạt số lượng sinh viên tối đa (${maxQuantity}).`);
            return;
        }
        if (addStudentClassIdInput) addStudentClassIdInput.value = classId;
        if (studentUsernameInput) studentUsernameInput.value = ''; // Reset input
        if (addStudentModal) addStudentModal.style.display = 'block';
    }

    // Xử lý submit form thêm sinh viên vào lớp
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const classId = addStudentClassIdInput.value;
            const studentUsername = studentUsernameInput.value; // Đây chính là Ma_Sinh_Vien

            try {
                const response = await fetch(`/mnglop/classes/${classId}/add-student`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ Tai_Khoan: studentUsername }) // Gửi Ma_Sinh_Vien
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Thêm sinh viên vào lớp thành công!');
                    if (addStudentModal) addStudentModal.style.display = 'none';
                    fetchClasses(); // Refresh danh sách
                } else {
                    alert(`Lỗi: ${result.message}`);
                }
            } catch (error) {
                console.error('Lỗi khi thêm sinh viên vào lớp:', error);
                alert('Đã xảy ra lỗi khi thêm sinh viên vào lớp');
            }
        });
    }

    // Initial fetch khi DOM đã load
    fetchClasses();
});