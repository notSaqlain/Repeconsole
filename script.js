document.addEventListener("DOMContentLoaded", function() {
    const calendarBody = document.getElementById("calendar-body");
    const daysInMonth = 28; // Febbraio 2025 ha 28 giorni

    // Ottenere il giorno attuale
    let today = new Date();
    let currentDay = today.getDate();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Start day (1° febbraio 2025 è sabato → 6° giorno della settimana)
    const startDay = (new Date(2025, 1, 1).getDay() + 6) % 7;

    // Events mapping (aggiorna se necessario)
    const events = {
        3: "Customer Insights",
        7: "Special Offer",
        10: "Resource List",
        14: "Video Demo",
        17: "Product Feature",
        21: "How-To Content",
        24: "Weekly Wrap-Up",
        28: "Quiz"
    };

    // Event colors
    const eventColors = {
        "Customer Insights": "blue",
        "Product Feature": "green",
        "Customer Review": "red",
        "Special Offer": "yellow",
        "Weekly Wrap-Up": "orange",
        "How-To Content": "green",
        "Quiz": "red",
        "Resource List": "blue",
        "Video Demo": "green",
        "Monday Motivation": "blue"
    };

    let dayCount = 1;
    for (let i = 0; i < 6; i++) { // Max 6 settimane
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");

            if ((i === 0 && j < startDay) || dayCount > daysInMonth) {
                cell.innerHTML = "";
            } else {
                cell.innerHTML = `<div>${dayCount}</div>`;
                cell.classList.add("calendar-day");

                if (dayCount === currentDay) {
                    cell.style.color = "red"; // Giorno attuale in rosso
                }

                if(dayCount === 6){
                    cell.style.color="gold";
                }

                // Aggiungi eventi se presenti
                if (events[dayCount]) {
                    let eventDiv = document.createElement("div");
                    eventDiv.classList.add("event", eventColors[events[dayCount]]);
                    eventDiv.innerText = events[dayCount];
                    cell.appendChild(eventDiv);
                }

                dayCount++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
        if (dayCount > daysInMonth) break;
    }
});
