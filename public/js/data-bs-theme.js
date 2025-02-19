/* eslint-disable no-undef -- used by html */
document.addEventListener("DOMContentLoaded", function () {
  // Prüfe, ob ein Theme in localStorage gespeichert ist
  const storedTheme = localStorage.getItem("theme");
  // Falls nicht, verwende die systemweite Einstellung
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const defaultTheme = storedTheme ? storedTheme : (prefersDark ? "dark" : "light");

  // Setze das data-bs-theme Attribut auf dem <html>-Element
  document.documentElement.setAttribute("data-bs-theme", defaultTheme);

  // Event Listener für Dunkelmodus
  document.getElementById("darkModeToggle").addEventListener("click", function (e) {
    e.preventDefault();
    document.documentElement.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
  });

  // Event Listener für Hellmodus
  document.getElementById("lightModeToggle").addEventListener("click", function (e) {
    e.preventDefault();
    document.documentElement.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
  });
});
