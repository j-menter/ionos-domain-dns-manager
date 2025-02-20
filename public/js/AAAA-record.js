/* eslint-disable no-undef -- used for history back btns in dns views */
document.addEventListener("DOMContentLoaded", function () {
  const includeWwwCheckbox = document.getElementById("include_www");
  const wwwRecord = document.getElementById("wwwRecord");
  const hostnameInput = document.getElementById("hostname");
  const ttlSelect = document.getElementById("ttl");
  const destinationInput = document.getElementById("destination");
  const previewRecord = document.getElementById("previewRecord");

  // Funktion zur Aktualisierung der Vorschau
  function updatePreview() {
    const domain = document.querySelector("[data-domain]").dataset.domain;
    const hostname = hostnameInput.value.trim();
    const destination = destinationInput.value.trim() || "IPv6-Adresse";
    const ttl = ttlSelect.value;

    if (hostname) {
      previewRecord.textContent = `${hostname}.${domain} ${ttl} IN AAAA ${destination}`;
      wwwRecord.textContent = `www.${hostname}.${domain} ${ttl} IN AAAA ${destination}`;
    } else {
      previewRecord.textContent = `${domain} ${ttl} IN AAAA ${destination}`;
      wwwRecord.textContent = `www.${domain} ${ttl} IN AAAA ${destination}`;
    }
  }

  // Checkbox initialisieren
  includeWwwCheckbox.value = includeWwwCheckbox.checked ? "true" : "false";
  includeWwwCheckbox.addEventListener("change", function () {
    this.value = this.checked ? "true" : "false";
    if (this.checked) {
      wwwRecord.classList.remove("text-decoration-line-through");
    } else {
      wwwRecord.classList.add("text-decoration-line-through");
    }
  });

  // Event Listener für die Eingabefelder
  hostnameInput.addEventListener("input", updatePreview);
  ttlSelect.addEventListener("change", updatePreview);
  destinationInput.addEventListener("input", updatePreview);

  // Initiale Vorschau setzen
  updatePreview();
});
