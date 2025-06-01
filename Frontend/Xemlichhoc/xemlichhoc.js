fetch('/layout/sidebar.html').then(response => response.text())
.then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    const toggleButton = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const icsInput = document.getElementById('icsFile');
    const clearBtn = document.getElementById('clearIcsBtn');
    const fileNameSpan = document.getElementById('fileName');
    const calendarEl = document.getElementById('calendar');

    function updateFileName(name) {
        if (fileNameSpan) fileNameSpan.textContent = name;
        if (clearBtn) clearBtn.classList.remove('hidden');
    }

    function clearFileDisplay() {
        if (icsInput) icsInput.value = '';
        if (fileNameSpan) fileNameSpan.textContent = 'Không có tệp nào được chọn';
        if (clearBtn) clearBtn.classList.add('hidden');
    }

    async function loadCalendarEvents() {
        const res = await fetch('/xemlichhoc/get', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!res.ok) {
            console.warn("Không có file .ics nào được lưu");
            return;
        }

        const icsText = await res.text();
        const jcalData = ICAL.parse(icsText);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        const events = [];

        vevents.forEach(evt => {
            const icalEvent = new ICAL.Event(evt);

            if (!icalEvent.isRecurring()) {
                events.push({
                    title: icalEvent.summary || "(Không tiêu đề)",
                    start: icalEvent.startDate.toJSDate(),
                    end: icalEvent.endDate.toJSDate(),
                });
            } else {
                const expansion = new ICAL.RecurExpansion({
                    component: evt,
                    dtstart: icalEvent.startDate
                });

                let count = 0;
                while (expansion.next() && count < 100) {
                    const nextDate = expansion.last.toJSDate();
                    const duration = icalEvent.endDate.subtractDate(icalEvent.startDate);
                    const endDate = expansion.last.clone();
                    endDate.addDuration(duration);

                    events.push({
                        title: icalEvent.summary || "(Không tiêu đề)",
                        start: nextDate,
                        end: endDate.toJSDate(),
                    });

                    count++;
                }
            }
        });

        calendar.removeAllEvents();
        calendar.addEventSource(events);

        // ✅ Hiển thị tên giả định của file
        updateFileName("23520501_scheduled.ics");
    }

    if (icsInput && clearBtn) {
        icsInput.addEventListener('change', async function () {
            const file = icsInput.files[0];
            if (!file) return;

            updateFileName(file.name);

            const formData = new FormData();
            formData.append("icsFile", file);

            const uploadRes = await fetch('/xemlichhoc/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: formData
            });

            if (uploadRes.ok) {
                await loadCalendarEvents();
            } else {
                alert("Upload thất bại!");
            }
        });

        clearBtn.addEventListener('click', async function () {
            clearFileDisplay();
            calendar.removeAllEvents();

            await fetch('/xemlichhoc/delete', {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });
        });
    }

    window.calendar = new window.FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'en',
        slotDuration: '01:00:00',
        slotLabelInterval: '01:00',
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        },
        slotMinTime: '06:00:00',
        slotMaxTime: '18:00:00',
        displayEventTime: true,
        displayEventEnd: true,
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
            hour12: true
        },
        eventDidMount: function (info) {
            const start = info.event.start ? info.event.start.toLocaleString('vi-VN') : '';
            const end = info.event.end ? info.event.end.toLocaleString('vi-VN') : '';
            const tooltipText = `${info.event.title}\n⏰ ${start} – ${end}`;
            info.el.setAttribute('title', tooltipText);
        },
        eventContent: function (arg) {
            return {
                html: `
                    <div class="custom-event">
                        <div class="time">
                            <div class="time-line">
                                <div class="fc-daygrid-event-dot"></div>
                                <span>${arg.timeText}</span>
                            </div>
                        </div>
                        <div class="title"><strong>${arg.event.title}</strong></div>
                    </div>
                `
            };
        },
        titleFormat: { year: 'numeric', month: 'long' },
        views: {
            dayGridMonth: { dayHeaderFormat: { weekday: 'short' } },
            timeGridWeek: { dayHeaderFormat: { weekday: 'short', day: 'numeric' }, allDaySlot: false },
            timeGridDay: { dayHeaderFormat: { weekday: 'long', day: 'numeric' }, allDaySlot: false },
        },
        events: []
    });

    calendar.render();
    loadCalendarEvents(); // 🚀 Tự động load khi vào trang
});
