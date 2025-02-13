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
            3: "Matteo Galdini 4cin", 4: "Matteo", 5: "Matteo", 6: "Matteo", 7: "Matteo", 8: "Matteo", 9: "Matteo",
            10: "Saqlain", 11: "Saqlain", 12: "Saqlain", 13: "Saqlain", 14: "Saqlain", 15: "Saqlain", 16: "Saqlain",
            17: "Kevin", 18: "Kevin", 19: "Kevin", 20: "Kevin", 21: "Kevin", 22: "Kevin", 23: "Kevin",
            24: "Damiano", 25: "Damiano", 26: "Damiano", 27: "Damiano", 28: "Damiano", 29: "Damiano", 30: "Damiano", 31: "Damiano"
        };

        const eventColors = {
            "Matteo": "blue",
            "Matteo Galdini 4cin": "blue",
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
                        
                        // Apply styling for flex layout
                        eventDiv.style.display = "flex";
                        eventDiv.style.alignItems = "center";
                        eventDiv.style.overflow = "hidden";
                        eventDiv.style.whiteSpace = "nowrap";
                        eventDiv.style.width = "87%"; // Adjust as needed
                        eventDiv.style.cursor = "pointer";
                        eventDiv.style.position = "relative";
                    
                        // Create image element
                        let img = document.createElement("img");
                        img.src = "./img/pf2.jpg";
                        img.alt = "Persona 2";
                        img.style.width = "20px";
                        img.style.height = "20px";
                        img.style.borderRadius = "50%";
                        img.style.marginRight = "5px";
                    
                        // Create outer text container
                        let textContainer = document.createElement("div");
                        textContainer.style.overflow = "hidden";
                        textContainer.style.whiteSpace = "nowrap";
                        textContainer.style.flexGrow = "1";
                        textContainer.style.position = "relative";
                        
                        // Create inner text div (for smooth scrolling)
                        let innerTextDiv = document.createElement("div");
                        innerTextDiv.innerText = events[dayCount];
                        innerTextDiv.style.display = "inline-block";
                        innerTextDiv.style.position = "relative";
                    
                        // Scroll effect on hover
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
                    
                        // Append text inside its container
                        textContainer.appendChild(innerTextDiv);
                        
                        // Append elements
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