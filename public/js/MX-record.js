/* eslint-disable no-undef -- used to load links of dns table */
document.addEventListener("DOMContentLoaded", function () {
  const hostnameInput = document.getElementById("hostname");
  const ttlSelect = document.getElementById("ttl");
  const destinationInput = document.getElementById("destination");
  const priorityInput = document.getElementById("priority");
  const previewRecord = document.getElementById("previewRecord");

  function updatePreview() {
    const domain = document.querySelector("[data-domain]").dataset.domain;
    const hostname = hostnameInput.value.trim();
    const destination = destinationInput.value.trim() || "mx01.beispiel.de";
    const priority = priorityInput.value.trim() || "10";
    const ttl = ttlSelect.value;

    if (hostname) {
      previewRecord.textContent = `${hostname}.${domain} ${ttl} IN MX ${priority} ${destination}`;
    } else {
      previewRecord.textContent = `${domain} ${ttl} IN MX ${priority} ${destination}`;
    }
  }

  hostnameInput.addEventListener("input", updatePreview);
  ttlSelect.addEventListener("change", updatePreview);
  destinationInput.addEventListener("input", updatePreview);
  priorityInput.addEventListener("input", updatePreview);

  document.querySelector(".btn-secondary").addEventListener("click", function (e) {
    e.preventDefault();
    window.history.back();
  });

  updatePreview();
});
