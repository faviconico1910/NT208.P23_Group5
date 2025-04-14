document.addEventListener("DOMContentLoaded", function () {
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
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message })
                });
                const data = await res.json();
                addMessage(data.reply, "bot");
            } catch (err) {
                addMessage("Có lỗi xảy ra!", "bot");
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
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatContent.appendChild(messageDiv);
        chatContent.scrollTop = chatContent.scrollHeight;
    }
}