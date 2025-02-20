/* eslint-disable no-undef -- used for history back btns in dns views */
document.addEventListener("DOMContentLoaded", function () {
  const hostnameInput = document.getElementById("hostname");
  const ttlSelect = document.getElementById("ttl");
  const valueInput = document.getElementById("value");
  const flagSelect = document.getElementById("flag");
  const caTypeSelect = document.getElementById("caType");
  const previewRecord = document.getElementById("previewRecord");

  function updatePreview() {
    const domain = document.querySelector("[data-domain]").dataset.domain;
    const hostname = hostnameInput.value.trim();
    const value = valueInput.value.trim() || "\"\"";
    const ttl = ttlSelect.value;
    const flag = flagSelect.value;
    const caType = caTypeSelect.value;

    if (hostname) {
      previewRecord.textContent = `${hostname}.${domain} ${ttl} IN CAA ${flag} ${caType} "${value}"`;
    } else {
      previewRecord.textContent = `${domain} ${ttl} IN CAA ${flag} ${caType} "${value}"`;
    }
  }

  hostnameInput.addEventListener("input", updatePreview);
  ttlSelect.addEventListener("change", updatePreview);
  valueInput.addEventListener("input", updatePreview);
  flagSelect.addEventListener("change", updatePreview);
  caTypeSelect.addEventListener("change", updatePreview);

  document.querySelector(".btn-secondary").addEventListener("click", function (e) {
    e.preventDefault();
    window.history.back();
  });

  updatePreview();
});
