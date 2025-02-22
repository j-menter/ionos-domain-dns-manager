/* eslint-disable no-undef -- used in html */
document.addEventListener("DOMContentLoaded", function () {
  const hostnameInput = document.getElementById("hostname");
  const ttlSelect = document.getElementById("ttl");
  const spfValueInput = document.getElementById("spfValue");
  const previewRecord = document.getElementById("previewRecord");

  function updatePreview() {
    const domain = document.querySelector("[data-domain]").dataset.domain;
    const hostname = hostnameInput.value.trim();
    const spfValue = spfValueInput.value.trim() || "v=spf1";
    const ttl = ttlSelect.value;
    const fqdn = hostname ? `${hostname}.${domain}` : domain;
    previewRecord.textContent = `${fqdn} ${ttl} IN TXT "${spfValue}"`;
  }

  hostnameInput.addEventListener("input", updatePreview);
  ttlSelect.addEventListener("change", updatePreview);
  spfValueInput.addEventListener("input", updatePreview);

  updatePreview();
  const spfToken = "(?:[+\\-~?]?(?:(?:all)|(?:a(?:\\:[^\\s]+)?)|(?:mx(?:\\:[^\\s]+)?)|(?:ip4:(?:\\d{1,3}\\.){3}\\d{1,3}(?:\\/\\d{1,2})?)|(?:ip6:[A-Fa-f0-9:]+(?:\\/\\d{1,3})?)|(?:include:[^\\s]+)|(?:exists:[^\\s]+))|(?:redirect=[^\\s]+)|(?:exp=[^\\s]+))";
  const spfRegex = new RegExp("^v=spf1\\s+" + spfToken + "(?:\\s+" + spfToken + ")*\\s*$", "i");

  const form = document.getElementById("spfForm");
  const spfInput = document.getElementById("spfValue");

  function validateSPF() {
    const spf = spfInput.value.trim();
    if (spfRegex.test(spf)) {
      spfInput.classList.remove("is-invalid");
      spfInput.classList.add("is-valid");
      return true;
    } else {
      spfInput.classList.add("is-invalid");
      spfInput.classList.remove("is-valid");
      return false;
    }
  }

  // Validierung bei jeder Eingabe
  spfInput.addEventListener("input", validateSPF);

  // Validierung beim Abschicken des Formulars
  form.addEventListener("submit", function (e) {
    if (!validateSPF()) {
      e.preventDefault();
      e.stopPropagation();
    }
    form.classList.add("was-validated");
  });
});
