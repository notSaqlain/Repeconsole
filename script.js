document.addEventListener("DOMContentLoaded", function() {
    const calendarBody = document.getElementById("calendar-body");
    const daysInMonth = 31;
    
    // Adjusted start day (Monday = 0, Sunday = 6)
    const startDay = (new Date(2025, 0, 1).getDay() + 6) % 7;

    // Events mapping
    const events = {
        1: "Customer Insights",
        4: "Special Offer",
        7: "Resource List",
        8: "Video Demo",
        9: "Product Feature",
        13: "Monday Motivation",
        21: "How-To Content",
        22: "Quiz",
        24: "Weekly Wrap-Up",
        30: "Special Offer"
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
    for (let i = 0; i < 6; i++) { // Max 6 weeks
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            if ((i === 0 && j < startDay) || dayCount > daysInMonth) {
                cell.innerHTML = "";
            } else {
                cell.innerHTML = `<div>${dayCount}</div>`;
                cell.classList.add("calendar-day");

                // Add event labels if available
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
