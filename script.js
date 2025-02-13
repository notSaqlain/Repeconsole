document.addEventListener("DOMContentLoaded", function () {
    const calendarBody = document.getElementById("calendar-body");
    const daysInMonth = 28;

    let today = new Date();
    let currentDay = today.getDate();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const startDay = (new Date(2025, 1, 1).getDay() + 6) % 7;

    const events = {
        3: "Matteo", 4: "Matteo", 5: "Matteo", 6: "Matteo", 7: "Matteo", 8: "Matteo", 9: "Matteo",
        10: "Saqlain", 11: "Saqlain", 12: "Saqlain", 13: "Saqlain", 14: "Saqlain", 15: "Saqlain", 16: "Saqlain",
        17: "Kevin", 18: "Kevin", 19: "Kevin", 20: "Kevin", 21: "Kevin", 22: "Kevin", 23: "Kevin",
        24: "Damiano", 25: "Damiano", 26: "Damiano", 27: "Damiano", 28: "Damiano",
    };

    const eventColors = {
        "Matteo": "blue",
        "Damiano": "green",
        "Saqlain": "yellow",
        "Kevin": "red",
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

                if (dayCount === currentDay) {
                    dayDiv.classList.add("today");
                    cell.classList.add("today-cell");
                }

                cell.appendChild(dayDiv);

                if (j === 6 || j === 5) {
                    cell.style.color = "red";
                }

                if (!dayDiv || dayDiv.innerText.trim() === "") {
                    cell.style.backgroundColor = "grey";
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

                    tooltip.style.visibility = "hidden";
                    tooltip.style.opacity = "0";

                    tooltipTimeout = setTimeout(() => {
                        let dayDiv = e.target.querySelector('.calendar-day');
                        if (dayDiv) {
                            let day = dayDiv.innerText;
                            let eventText = events[day];
                            tooltip.innerText = `Giorno ${day} Febbraio\n${eventText || 'Nessun evento'}`;
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

                dayCount++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        if (dayCount > daysInMonth) break;
    }
});