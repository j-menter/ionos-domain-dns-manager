/* eslint-disable no-undef -- used to load links of dns table */
document.addEventListener("DOMContentLoaded", function () {
  const pathParts = window.location.pathname.split("/");
  const domain = pathParts[2];

  // Klickbare Zeilen: Alle <tr> mit data-record-type
  document.querySelectorAll("tr.clickable-row").forEach((row) => {
    row.addEventListener("click", function () {
      window.location.href = `/domain/${domain}/createDns/${this.getAttribute("data-record-type")}`;
    });
    row.style.cursor = "pointer";
  });

  // Header-Text aktualisieren
  const header = document.querySelector("h1.text-center");
  if (header) {
    header.innerHTML = `DNS Records zu <b>${domain}</b> hinzufügen`;
  }

  // Back-Link aktualisieren
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.setAttribute("href", `/domain/${domain}/`);
  }
});
