document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.getElementById("calendar-body");
  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  let today = new Date();
  let currentDay = today.getDate();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  // Variabili globali per memorizzare l'evento corrente
  let currentEventDate = null;
  let currentEventPersonName = null;

  // Opzionale: mappa persona -> colore predefinito
  const userColors = {
    "Saqlain Khalid": "#f1c40f",   // giallo
    "Merkaj Kevin":   "#e74c3c",   // rosso
    "Damiano Borrelli":"#2ecc71",  // verde
    "Matteo Galdini": "#3498db"    // blu
  };

  /**
   * Carica tutti gli eventi dal server (endpoint "/listaEventi").
   * Restituisce un array di oggetti: [{date, personName, color}, ...].
   */
  async function loadEventsFromServer() {
    try {
      const response = await fetch("listaEventi"); 
      if (!response.ok) {
        console.error("Errore nel caricamento eventi:", response.status);
        return [];
      }
      return await response.json(); // array di CalendarEvent
    } catch (error) {
      console.error("Eccezione nella fetch listaEventi:", error);
      return [];
    }
  }

  /**
   * Aggiorna il calendario per il mese/anno correnti.
   * 1) Legge tutti gli eventi dal server
   * 2) Crea una mappa day -> { personName, color } filtrando su month/year
   * 3) Costruisce la tabella
   */
  async function updateCalendar(month, year) {
    calendarBody.innerHTML = "";

    // Esempio: numero di giorni nel mese e giorno di inizio
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (new Date(year, month, 1).getDay() + 6) % 7;

    // 1) Carico gli eventi dal server
    const allEvents = await loadEventsFromServer();

    // 2) Creiamo una mappa "numeroGiorno -> { personName, color }" solo per month e year
    let eventsMap = {};
    allEvents.forEach(ev => {
      // ev.date in formato "YYYY-MM-DD"
      const [y, m, d] = ev.date.split("-").map(Number); 
      // m-1 perché i mesi JS partono da 0
      if (y === year && (m - 1) === month) {
        eventsMap[d] = {
          personName: ev.personName,
          color: ev.color
        };
      }
    });

    let dayCount = 1;
    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    // 3) Costruisce le righe (max 6)
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");
        cell.classList.add("cell");

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

          // Sabato e domenica in rosso
          if (j === 5 || j === 6) {
            cell.style.color = "red";
          }

          // Se esiste un evento per dayCount
          if (eventsMap[dayCount]) {
            let { personName, color } = eventsMap[dayCount];
            
            // Se manca color, usiamo userColors come fallback
            if (!color && userColors[personName]) {
              color = userColors[personName];
            } else if (!color) {
              color = "#888"; // fallback generico
            }

            let eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.style.backgroundColor = color;
            eventDiv.style.display = "flex";
            eventDiv.style.alignItems = "center";
            eventDiv.style.overflow = "hidden";
            eventDiv.style.whiteSpace = "nowrap";
            eventDiv.style.width = "100%";
            eventDiv.style.cursor = "pointer";
            eventDiv.style.position = "relative";
            eventDiv.style.boxSizing = "border-box";


            // Immagine utente (0px x 0px)
            let img = document.createElement("img");
            img.src = "img/pf2.jpg";
            img.alt = "Persona 2";
            img.style.width = "0px";
            img.style.height = "0px";
            img.style.borderRadius = "50%";
            img.style.marginRight = "0px";

            let textContainer = document.createElement("div");
            textContainer.style.overflow = "hidden";
            textContainer.style.whiteSpace = "nowrap";
            textContainer.style.flexGrow = "1";
            textContainer.style.position = "relative";

            let innerTextDiv = document.createElement("div");
            innerTextDiv.innerText = personName;
            innerTextDiv.style.display = "inline-block";
            innerTextDiv.style.position = "relative";

            // Effetto scroll orizzontale se testo più lungo del contenitore
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
            // eventDiv.appendChild(img); // Non usato pk aggiunge l'immagine utente al div
            eventDiv.appendChild(textContainer); // Appenda il div con il testo all'evento
            cell.appendChild(eventDiv);
          }

          // Tooltip
          cell.addEventListener("mouseenter", (e) => {
            let day = dayDiv.innerText;
            let eventText = eventsMap[day] ? eventsMap[day].personName : "Nessun evento";
            // Usiamo i backtick
            tooltip.style.color = "transparent";
            //tooltip.innerText = `Giorno ${day} ${monthNames[month]}\n${eventText}`;  // non si vede
            tooltip.style.opacity = "1";
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY - 30 + "px";
          });

          cell.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY - 30 + "px";
         });

          cell.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
          });

          // Click sulla cella => popup
          cell.addEventListener("click", () => {
            let day = dayDiv.innerText;
            let eventDetail = eventsMap[day] ? eventsMap[day].personName : "Nessun evento";
            showPopup(day, eventDetail);
          });

          dayCount++;
        }
        row.appendChild(cell);
      }
      calendarBody.appendChild(row);
      if (dayCount > daysInMonth) break;
    }

    document.getElementById("month-year").innerText = monthNames[month];
    document.getElementById("year").innerText = year;
    tooltip.style.opacity = "0";
  }

  // Bottoni Prev/Next
  const prevBtn = document.querySelector(".btn-prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateCalendar(currentMonth, currentYear);
    });
  }

  const nextBtn = document.querySelector(".btn-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      updateCalendar(currentMonth, currentYear);
    });
  }

  // All'avvio: carica il calendario
  updateCalendar(currentMonth, currentYear);

  // Gestione popup
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");
  const userPopup = document.getElementById("user-popup");
  const closeUserPopup = document.getElementById("closeUserPopup");
  const userSelectContainer = document.querySelector(".select-container");
  const addUserButton = document.querySelector(".button-container.add-user");
  const removeUserButton = document.querySelector(".button-container.remove-user");

  function showPopup(day, eventDetail) {
    let dateString = `${currentYear}-${String(currentMonth+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    currentEventDate = dateString;
    currentEventPersonName = eventDetail;

    if (eventDetail && eventDetail !== "Nessun evento") {
      // User is already selected
      userSelectContainer.style.display = "none";
      addUserButton.style.display = "none";
      removeUserButton.style.display = "flex";
      document.getElementById("popup-name").innerText = `Dettaglio Evento: ${eventDetail}`;
      document.getElementById("popup-contact").innerText = `Contatto: ${eventDetail.toLowerCase().replace(' ', '.')}@unipol.it`;
      document.getElementById("popup-numero").innerText = `+39 000 000 0000`;
    } else {
      // No user selected
      userSelectContainer.style.display = "block";
      addUserButton.style.display = "flex";
      removeUserButton.style.display = "none";
      document.getElementById("popup-name").innerText = `Giorno ${day}`;
      document.getElementById("popup-contact").innerText = "";
      document.getElementById("popup-numero").innerText = "";
    }

    popup.style.display = "flex";
  }

  function hidePopup() {
    popup.style.display = "none";
    currentEventDate = null;
    currentEventPersonName = null;
    // resetUserSelect();
  }

  if (closePopup) {
    closePopup.addEventListener("click", hidePopup);
  }
  window.addEventListener("click", (event) => {
    if (event.target === popup) {
      hidePopup();
    }
    if (event.target === userPopup) {
      userPopup.style.display = "none";
    }
  });

  // Popup dettagli utente (cliccando nella lista a sinistra)
  const users = document.querySelectorAll(".user-container");
  users.forEach(user => {
    user.addEventListener("click", () => {
      const userName = user.getAttribute("data-user");
      showUserPopup(userName);
    });
  });

  function showUserPopup(userName) {
    document.getElementById("user-popup-name").innerText = userName;
    document.getElementById("user-popup-email").innerText = `email: ${userName.toLowerCase().replace(' ', '.')}@unipol.it`;
    userPopup.style.display = "flex";
  }

  if (closeUserPopup) {
    closeUserPopup.addEventListener("click", () => {
      userPopup.style.display = "none";
    });
  }

  // Selezione uffici
  const officeItems = document.querySelectorAll(".office-item");
  const selectedOfficeElement = document.getElementById("selected-office");
  officeItems.forEach(item => {
    item.addEventListener("click", function () {
      officeItems.forEach(office => office.classList.remove("active"));
      this.classList.add("active");
      selectedOfficeElement.textContent = this.textContent;
    });
  });

  // Aggiungi Utente
  const userSelect = document.getElementById("user-select");
  const addUserBtn = document.querySelector(".button-container.add-user");
  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      if (!currentEventDate) {
        alert("Nessun giorno selezionato!");
        return;
      }
      const selectedPerson = userSelect.value;
      if (!selectedPerson) {
        alert("Seleziona un utente prima di aggiungere!");
        return;
      }
      const color = userColors[selectedPerson] || "gray";

      const eventData = {
        date: currentEventDate,
        personName: selectedPerson,
        color: color
      };

      fetch("aggiungiUtente", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(eventData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Errore durante l'aggiunta dell'evento.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Successo:", data);
        alert("Evento aggiunto con successo!");
        updateCalendar(currentMonth, currentYear);
        hidePopup();
      })
      .catch(error => {
        console.error("Errore:", error);
        alert("Errore durante l'aggiunta dell'evento.");
      });
    });
  }

  // Rimuovi Utente
  const removeUserBtn = document.querySelector(".button-container.remove-user");
  if (removeUserBtn) {
    removeUserBtn.addEventListener("click", () => {
      if (!currentEventDate) {
        alert("Nessun evento selezionato per la rimozione.");
        return;
      }
      const eventData = {
        date: currentEventDate,
        personName: currentEventPersonName
      };

      fetch("rimuoviUtente", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(eventData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Errore durante la rimozione dell'evento.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Successo:", data);
        if (data.status === "success") {
          alert("Evento rimosso con successo!");
          updateCalendar(currentMonth, currentYear);
          hidePopup();
        } else {
          alert("Evento non trovato.");
        }
      })
      .catch(error => {
        console.error("Errore:", error);
        alert("Errore durante la rimozione dell'evento.");
      });
    });
  }

  /*
  // Aggiungi utente: resetta la select
  const one = document.getElementById('user-select');
  const two = document.getElementById('closePopup');
  const three = document.querySelector('.add-user');

  function resetUserSelect() {
    one.value = '';
  }

  two.addEventListener('click', resetUserSelect);
  three.addEventListener('click', resetUserSelect);
  */
});