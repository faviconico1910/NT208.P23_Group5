document.addEventListener("DOMContentLoaded", function () {
    fetch("/chatbot.html") // Đảm bảo đường dẫn đúng
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
            attachChatEvent(); // Gắn sự kiện sau khi chèn HTML
        })
        .catch(error => console.error("Lỗi khi tải chatbot:", error));
});

function attachChatEvent() {
    var chatBox = document.getElementById("chatBox");
    var chatIcon = document.querySelector(".chat-icon");

    if (!chatBox || !chatIcon) {
        console.error("Không tìm thấy phần tử chatbot!");
        return;
    }

    window.toggleChat = function () {
        if (chatBox.style.display === "none" || chatBox.style.display === "") {
            chatBox.style.display = "flex";
            chatIcon.style.display = "none";
        } else {
            chatBox.style.display = "none";
            chatIcon.style.display = "flex";
        }
    };

    window.sendMessage = function () {
        let input = document.querySelector(".chat-footer input");
        let message = input.value.trim();
        if (message) {
            let chatContent = document.querySelector(".chat-content");
            chatContent.innerHTML += `<p><strong>Bạn:</strong> ${message}</p>`;
            input.value = ""; // Xóa nội dung input sau khi gửi
        }
    };
}
