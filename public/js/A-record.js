/* eslint-disable no-undef -- used by html */
document.addEventListener("DOMContentLoaded", function () {
  const includeWwwCheckbox = document.getElementById("include_www");
  const wwwRecord = document.getElementById("wwwRecord");
  const hostnameInput = document.getElementById("hostname");
  const ttlSelect = document.getElementById("ttl");
  const destinationInput = document.getElementById("destination");
  const previewRecord = document.getElementById("previewRecord");
  const submitBtn = document.getElementById("submitBtn");
  const dnsForm = document.getElementById("dnsForm");

  // Funktion zur Aktualisierung der Vorschau
  function updatePreview() {
    const domain = document.querySelector("[data-domain]").dataset.domain;
    ;
    const hostname = hostnameInput.value.trim();
    const destination = destinationInput.value.trim() || "IPv4-Adresse";
    const ttl = ttlSelect.value;

    if (hostname) {
      previewRecord.textContent = `${hostname}.${domain} ${ttl} IN A ${destination}`;
      wwwRecord.textContent = `www.${hostname}.${domain} ${ttl} IN A ${destination}`;
    } else {
      previewRecord.textContent = `${domain} ${ttl} IN A ${destination}`;
      wwwRecord.textContent = `www.${domain} ${ttl} IN A ${destination}`;
    }
  }

  // Initialen Wert für include_www setzen
  includeWwwCheckbox.value = includeWwwCheckbox.checked ? "true" : "false";
  includeWwwCheckbox.addEventListener("change", function () {
    this.value = this.checked ? "true" : "false";
    if (this.checked) {
      wwwRecord.classList.remove("text-decoration-line-through");
    } else {
      wwwRecord.classList.add("text-decoration-line-through");
    }
  });

  hostnameInput.addEventListener("input", updatePreview);
  ttlSelect.addEventListener("change", updatePreview);

  const ipv4Regex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;

  destinationInput.addEventListener("input", function () {
    updatePreview();
    const value = destinationInput.value.trim();
    if (ipv4Regex.test(value)) {
      destinationInput.classList.remove("is-invalid");
      destinationInput.classList.add("is-valid");
      submitBtn.disabled = false;
    } else {
      destinationInput.classList.remove("is-valid");
      destinationInput.classList.add("is-invalid");
      submitBtn.disabled = true;
    }
  });

  dnsForm.addEventListener("submit", function (e) {
    const value = destinationInput.value.trim();
    if (!ipv4Regex.test(value)) {
      e.preventDefault();
      destinationInput.focus();
    }
  });

  updatePreview();
});
