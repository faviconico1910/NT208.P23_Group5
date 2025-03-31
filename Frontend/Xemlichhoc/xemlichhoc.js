fetch('/layout/sidebar.html').then(response => response.text())
            .then(html => {
                document.getElementById("sidebar-container").innerHTML = html;
                const toggleButton = document.getElementById("toggle-btn");
                const sidebar = document.getElementById("sidebar");

                toggleButton.addEventListener("click", () => {
                    sidebar.classList.toggle("collapsed");
                })
            });