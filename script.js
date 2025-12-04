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
});