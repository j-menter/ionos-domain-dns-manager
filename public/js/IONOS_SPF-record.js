/* eslint-disable no-undef -- used by html */
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
});
