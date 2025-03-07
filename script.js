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
                        const user_details = cell.getAttribute('data-user');
                        showPopup(parseInt(day, 10), events[dayCount], user_details);
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

    const tansitionTimePerPixel = 0.01;
    const textBoxes = document.querySelectorAll(
        ".textBox"
    );

    textBoxes.forEach((textBox) => {
        textBox.addEventListener('mouseenter', () => {
            let textWidth = textBox.lastChild.clientWidth;
            let boxWidth = parseFloat(getComputedStyle(textBox).width);
            let translateVal = Math.min(boxWidth - textWidth, 0);
            let translateTime = - tansitionTimePerPixel * translateVal + "s";
            textBox.lastChild.style.transitionDuration = translateTime;
            textBox.lastChild.style.transform = "translateX(" + translateVal + "px)";
        });
        textBox.addEventListener('mouseleave', () => {
            textBox.lastChild.style.transitionDuration = "0.3s";
            textBox.lastChild.style.transform = "translateX(0)";
        });
    });


    /* POPUP */
    const users = document.querySelectorAll('.user-container');
    const userPopup = document.getElementById('user-popup');
    const closeUserPopup = document.getElementById('closeUserPopup');

    function showPopup(userName, user_details) {
        document.getElementById('popup-name').innerText = userName;
        document.getElementById('user-popup-name').innerText = user_details;
        document.getElementById('user-popup-email').innerText = `email: ${user_details.toLowerCase().replace(' ', '.')}@unipol.it`;
        popup.style.display = 'flex';
    }

    function hidePopup() {
        popup.style.display = 'none';
        const addUserBtn = document.querySelector('.button-container[style="background: rgb(101, 255, 101);"]');
        const removeUserBtn = document.querySelector('.button-container[style="background: rgb(255, 95, 95);"]');
        const popupEmail = document.querySelector('.popup-email');
        if (popupEmail) {
            popupEmail.remove();
        }

    }

    closePopup.addEventListener('click', hidePopup);

    /*CHIUDE POPUP SE CLICCO FUORI */
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            hidePopup();
        }
    });

    /*POPUP UTENTI */
    users.forEach(user => {
        user.addEventListener('click', () => {
            const userName = user.getAttribute('data-user');
            showUserPopup(userName);
        });
    });

    closeUserPopup.addEventListener('click', hideUserPopup);

    function showUserPopup(userName) {
        document.getElementById('user-popup-name').innerText = userName;
        document.getElementById('user-popup-email').innerText = `email: ${userName.toLowerCase().replace(' ', '.')}@unipol.it`;
        userPopup.style.display = 'flex';
    }

    function hideUserPopup() {
        userPopup.style.display = 'none';
    }

    /*CHIUDE POPUP SE CLICCO FUORI */
    window.addEventListener('click', (event) => {
        if (event.target === userPopup) {
            hideUserPopup();
        }
    });


    /* SELEZIONA UFFICI */
    const officeItems = document.querySelectorAll('.office-item');
    const selectedOfficeElement = document.getElementById('selected-office');
    officeItems.forEach(item => {
        item.addEventListener('click', function() {
            officeItems.forEach(office => office.classList.remove('active'));
            this.classList.add('active');
            selectedOfficeElement.textContent = this.textContent;
        });
    });
});