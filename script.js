document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slideshow img");
  let current = 0;

  if (slides.length === 0) return;

  slides[current].classList.add("active");

  setInterval(() => {
    slides[current].classList.remove("active");

    current = (current + 1) % slides.length;

    slides[current].classList.add("active");
  }, 2000);
});