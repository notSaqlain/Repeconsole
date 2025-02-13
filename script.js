document.addEventListener("DOMContentLoaded", function () {
    const calendarBody = document.getElementById("calendar-body");
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    
    let today = new Date();
    let currentDay = today.getDate();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();


    function updateCalendar(month, year) {
        calendarBody.innerHTML = "";

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = (new Date(year, month, 1).getDay() + 6) % 7;

        const events = {
            3: "Galdini Matteo", 4: "Galdini Matteo", 5: "Galdini Matteo", 6: "Galdini Matteo", 7: "Galdini Matteo", 8: "Galdini Matteo", 9: "Galdini Matteo",
            10: "Khalid Saqlain", 11: "Khalid Saqlain", 12: "Khalid Saqlain", 13: "Khalid Saqlain", 14: "Khalid Saqlain", 15: "Khalid Saqlain", 16: "Khalid Saqlain",
            17: "Merkaj Kevin", 18: "Merkaj Kevin", 19: "Merkaj Kevin", 20: "Merkaj Kevin", 21: "Merkaj Kevin", 22: "Merkaj Kevin", 23: "Merkaj Kevin",
            24: "Borrelli Damiano", 25: "Borrelli Damiano", 26: "Borrelli Damiano", 27: "Borrelli Damiano", 28: "Borrelli Damiano", 29: "Borrelli Damiano", 30: "Borrelli Damiano", 31: "Borrelli Damiano"
        };

        const eventColors = {
            "Galdini Matteo": "blue",
            "Borrelli Damiano": "green",
            "Khalid Saqlain": "yellow",
            "Merkaj Kevin": "red",
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
                        
                        
                        eventDiv.style.display = "flex";
                        eventDiv.style.alignItems = "center";
                        eventDiv.style.overflow = "hidden";
                        eventDiv.style.whiteSpace = "nowrap";
                        eventDiv.style.width = "100%";
                        eventDiv.style.cursor = "pointer";
                        eventDiv.style.position = "relative";
                        eventDiv.style.boxSizing = "border-box";
                    
                        // crea icona image
                        let img = document.createElement("img");
                        img.src = "./img/pf2.jpg";
                        img.alt = "Persona 2";
                        img.style.width = "20px";
                        img.style.height = "20px";
                        img.style.borderRadius = "50%";
                        img.style.marginRight = "5px";
                    
                        
                        let textContainer = document.createElement("div");
                        textContainer.style.overflow = "hidden";
                        textContainer.style.whiteSpace = "nowrap";
                        textContainer.style.flexGrow = "1";
                        textContainer.style.position = "relative";
                    
                        
                        let innerTextDiv = document.createElement("div");
                        innerTextDiv.innerText = events[dayCount];
                        innerTextDiv.style.display = "inline-block";
                        innerTextDiv.style.position = "relative";
                    
                        textContainer.addEventListener("mouseenter", () => {
                            let scrollWidth = innerTextDiv.scrollWidth;
                            let containerWidth = textContainer.clientWidth;
                    
                            if (scrollWidth > containerWidth) {
                                innerTextDiv.style.transition = `transform ${(scrollWidth - containerWidth) / 50}s linear`;
                                innerTextDiv.style.transform = `translateX(-${scrollWidth - containerWidth}px)`;
                            }
                        });
                    
                        textContainer.addEventListener("mouseleave", () => {
                            innerTextDiv.style.transition = "transform 0.5s ease-out";
                            innerTextDiv.style.transform = "translateX(0)";
                        });
                    

                        textContainer.appendChild(innerTextDiv);
                        eventDiv.appendChild(img);
                        eventDiv.appendChild(textContainer);
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

        document.getElementById("month-year").innerText = `${monthNames[month]}`;
        document.getElementById("year").innerText = `${year}`;

        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
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