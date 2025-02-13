document.addEventListener("DOMContentLoaded", function () {
    const calendarBody = document.getElementById("calendar-body");
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    
    let today = new Date();
    let currentDay = today.getDate();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function updateCalendar(month, year) {
        calendarBody.innerHTML = ""; // Pulisci il contenuto della tabella

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = (new Date(year, month, 1).getDay() + 6) % 7;

        const events = {
            3: "Matteo Galdini", 4: "Matteo Galdini", 5: "Matteo Galdini", 6: "Matteo Galdini", 7: "Matteo Galdini", 8: "Matteo Galdini", 9: "Matteo Galdini",
            10: "Saqlain Khalid", 11: "Saqlain Khalid", 12: "Saqlain Khalid", 13: "Saqlain Khalid", 14: "Saqlain Khalid", 15: "Saqlain Khalid", 16: "Saqlain Khalid",
            17: "Kevin Merkaj", 18: "Kevin Merkaj", 19: "Kevin Merkaj", 20: "Kevin Merkaj", 21: "Kevin Merkaj", 22: "Kevin Merkaj", 23: "Kevin Merkaj",
            24: "Damiano Borrels", 25: "Damiano Borrels", 26: "Damiano Borrels", 27: "Damiano Borrels", 28: "Damiano Borrels", 29: "Damiano Borrels", 30: "Damiano Borrels", 31: "Damiano Borrels"
        };

        const eventColors = {
            "Matteo Galdini": "blue",
            "Damiano Borrels": "green",
            "Saqlain Khalid": "yellow",
            "Kevin Merkaj": "red",
        };

        let dayCount = 1;
        let tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        document.body.appendChild(tooltip);

        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("td");

                if ((i === 0 && j < startDay) || dayCount > daysInMonth) {
                    cell.innerHTML = "";
                } else {
                    let dayDiv = document.createElement("div");
                    dayDiv.innerText = dayCount;
                    dayDiv.classList.add("calendar-day");

                    // Evidenzia il giorno corrente
                    if (dayCount === currentDay && month === today.getMonth() && year === today.getFullYear()) {
                        dayDiv.classList.add("today");
                        cell.classList.add("today-cell");
                    }

                    cell.appendChild(dayDiv);

                    if (j === 6 || j === 5) {
                        cell.style.color = "red";
                    }

                    if (events[dayCount]) {
                        let eventDiv = document.createElement("div");
                        eventDiv.classList.add("event", eventColors[events[dayCount]]);
                        eventDiv.innerText = events[dayCount];
                        cell.appendChild(eventDiv);
                    }

                    let tooltipTimeout;

                    cell.addEventListener("mouseenter", (e) => {
                        if (tooltipTimeout) {
                            clearTimeout(tooltipTimeout);
                        }

                        tooltipTimeout = setTimeout(() => {
                            let dayDiv = e.target.querySelector('.calendar-day');
                            if (dayDiv) {
                                let day = dayDiv.innerText;
                                let eventText = events[day];
                                tooltip.innerText = `Giorno ${day} ${monthNames[month]}\n${eventText || 'Nessun evento'}`;
                                tooltip.style.visibility = "visible";
                                tooltip.style.opacity = "1";
                                tooltip.style.left = e.pageX + 10 + "px";
                                tooltip.style.top = e.pageY - 30 + "px";
                            }
                        }, 250);
                    });

                    cell.addEventListener("mousemove", (e) => {
                        tooltip.style.left = e.pageX + 10 + "px";
                        tooltip.style.top = e.pageY - 30 + "px";
                    });

                    cell.addEventListener("mouseleave", () => {
                        tooltip.style.visibility = "hidden";
                        tooltip.style.opacity = "0";
                    });

                    cell.addEventListener("click", () => {
                        let day = dayDiv.innerText;
                        showPopup(parseInt(day, 10), events[dayCount]);
                    });

                    dayCount++;
                }

                row.appendChild(cell);
                cell.classList.add("cell");
            }
            calendarBody.appendChild(row);
            if (dayCount > daysInMonth) break;
        }

        document.getElementById("month-year").innerText = `${monthNames[month]} ${year}`;
    }

    function showPopup(day, event) {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-btn">&times;</span>
                <h2>GIORNO ${day}</h2>
                <p>Event: ${event || 'No event'}</p>
            </div>
        `;
        document.body.appendChild(popup);

        popup.querySelector(".close-btn").addEventListener("click", () => {
            popup.remove();
        });

        window.addEventListener("click", (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
    }

    document.querySelector(".btn-prev").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar(currentMonth, currentYear);
    });

    document.querySelector(".btn-next").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar(currentMonth, currentYear);
    });

    updateCalendar(currentMonth, currentYear);
});
