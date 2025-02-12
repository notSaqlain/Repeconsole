document.addEventListener("DOMContentLoaded", function () {
    const calendarBody = document.getElementById("calendar-body");
    const daysInMonth = 28; // Febbraio 2025 ha 28 giorni

    let today = new Date();
    let currentDay = today.getDate();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const startDay = (new Date(2025, 1, 1).getDay() + 6) % 7;

    const events = {
        3: "Persona 1",
        7: "Special Offer",
        10: "Resource List",
        14: "Video Demo",
        17: "Product Feature",
        21: "How-To Content",
        24: "Weekly Wrap-Up",
    };

    const eventColors = {
        "Persona 1": "blue",
        "Product Feature": "green",
        "Special Offer": "yellow",
        "Weekly Wrap-Up": "orange",
        "How-To Content": "green",
        "Resource List": "blue",
        "Video Demo": "green",
        "Monday Motivation": "blue",
    };

    let dayCount = 1;

    // Creazione del tooltip
    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    for (let i = 0; i < 6; i++) { // Max 6 settimane
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
                }
                if (dayCount === currentDay) {
                    dayDiv.classList.add("today");
                    cell.classList.add("today-cell"); // Aggiungi una classe alla cella
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

                // Tooltip quando si passa sopra il giorno
                let tooltipTimeout;

                cell.addEventListener("mouseenter", (e) => {
                    // Nascondi temporaneamente il tooltip
                    if (tooltipTimeout) {
                        clearTimeout(tooltipTimeout); // Se c'è già un timeout attivo, cancellalo
                    }
                    
                    tooltip.style.visibility = "hidden";  // Nascondi il tooltip
                    tooltip.style.opacity = "0";         // Riduci l'opacità a 0

                    tooltipTimeout = setTimeout(() => {
                        let dayDiv = e.target.querySelector('.calendar-day'); // Trova il div con il giorno
                        if (dayDiv) {
                            let day = dayDiv.innerText; // Ottieni il giorno dalla cella
                            let eventText = events[day]; // Ottieni l'evento per quel giorno
                            tooltip.innerText = `Giorno ${day} Febbraio\n${eventText || 'Nessun evento'}`;
                            tooltip.style.visibility = "visible";  // Mostra il tooltip
                            tooltip.style.opacity = "1";            // Imposta opacità a 1
                            tooltip.style.left = e.pageX + 10 + "px";  // Posiziona il tooltip
                            tooltip.style.top = e.pageY - 30 + "px";   // Posiziona il tooltip
                        }
                    }, 250); // 500 millisecondi di ritardo (puoi regolare questo valore)
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