document.addEventListener("DOMContentLoaded", () => {
  // ===== Slideshow im Hero-Bereich =====
  const slides = document.querySelectorAll(".hero-slideshow img");
  let current = 0;

  if (slides.length === 0) return;

  slides[current].classList.add("active");

  setInterval(() => {
    slides[current].classList.remove("active");

    current = (current + 1) % slides.length;

    slides[current].classList.add("active");
  }, 2000);

  // ===== Kommentarbereich einblenden =====
  // Alle Links „Kommentar schreiben“ auswählen
  const commentLinks = document.querySelectorAll(".show-comments");

  // Für jeden Link einen Klick-Handler registrieren
  commentLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      // Standardaktion des Links (Sprung zu "#") verhindern
      event.preventDefault();

      // Der nächste Nachbar-Knoten nach dem Link ist der Kommentarbereich (<div class="comments">)
      const commentsBox = link.nextElementSibling;

      if (commentsBox) {
        // Falls ein Kommentarbereich existiert: anzeigen
        commentsBox.style.display = "grid";

        // Link nach dem Öffnen ausblenden
        link.style.display = "none";
      }
    });
  });
   // ===== Zeichen-Zähler für Textareas =====
  const textareas = document.querySelectorAll(".comments textarea");
  const max = 500;

  textareas.forEach((textarea) => {
    const counter = textarea.nextElementSibling; // div.char-counter

    // Anfangswert setzen
    counter.textContent = `${max - textarea.value.length} Zeichen übrig`;

    textarea.addEventListener("input", () => {
      const remaining = max - textarea.value.length;
      counter.textContent = `${remaining} Zeichen übrig`;
    });
  });
  // ===== AJAX: Neuigkeiten laden =====
  // Auswahlfeld (Dropdown) und Ausgabebereich aus dem DOM holen
  const select = document.getElementById("news-select");
  const panel = document.getElementById("game-panel");

  // Prüfen, ob beide Elemente auf der Seite vorhanden sind
  if (select && panel) {
    // Elemente für Titel und Beschreibung innerhalb des Panels auswählen
    const titleEl = panel.querySelector(".title");
    const descEl = panel.querySelector(".description");

    // Event-Listener für Änderungen im Auswahlfeld registrieren
    select.addEventListener("change", () => {
      // Der value-Wert enthält den Pfad zur JSON-Datei
      const url = select.value;
       // Falls keine Neuigkeit ausgewählt wurde
      if (!url) {
        titleEl.textContent = "–";
        descEl.textContent = "Bitte eine Neuigkeit auswählen.";
        return;
      }

      // Asynchrones Laden der JSON-Datei mit der Fetch-API
      fetch(url)
        .then((response) => {
          // Überprüfen, ob die HTTP-Anfrage erfolgreich war
          if (!response.ok) throw new Error("HTTP " + response.status);
          // Antwort in ein JavaScript-Objekt (JSON) umwandeln
          return response.json();
        })
        .then((data) => {
          // Die geladenen Daten in die HTML-Seite einfügen
          titleEl.textContent = data.title ?? "–";
          descEl.textContent = data.description ?? "";
        })
        .catch((err) => {
          // Fehlerbehandlung bei fehlgeschlagener Anfrage
          titleEl.textContent = "Fehler";
          descEl.textContent = "Die Neuigkeit konnte nicht geladen werden.";
          console.error(err);
        });
    });
  }
});