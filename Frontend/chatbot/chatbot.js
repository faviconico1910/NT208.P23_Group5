document.addEventListener("DOMContentLoaded", function () {
    // Thêm marked từ CDN nếu chưa có
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(script);
    
    fetch("/chatbot.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
            attachChatEvent();
        })
        .catch(error => console.error("Lỗi khi tải chatbot:", error));
});

function attachChatEvent() {
    const chatBox = document.getElementById("chatBox");
    const chatIcon = document.querySelector(".chat-icon");

    window.toggleChat = function () {
        chatBox.style.display = (chatBox.style.display === "none") ? "flex" : "none";
    };

    window.sendMessage = async function () {
        const input = document.getElementById("chatInput");
        const message = input.value.trim();

        if (message) {
            addMessage(message, "user");
            input.value = "";

            try {
                const res = await fetch("/chatbot/api", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message })
                });
                const data = await res.json();
                addMessage(data.reply, "bot");
            } catch (err) {
                addMessage("Hệ thống bận, thử lại nhé!", "bot");
            }
        }
    };

    window.handleKeyPress = function (e) {
        if (e.key === "Enter") sendMessage();
    };
    function addMessage(text, sender) {
        const chatContent = document.getElementById("chatContent");
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${text.replace(/\n/g, "<br>")}</p>`; // Chuyển \n thành <br> cho xuống dòng
        chatContent.appendChild(messageDiv);
        chatContent.scrollTop = chatContent.scrollHeight;
    }
}