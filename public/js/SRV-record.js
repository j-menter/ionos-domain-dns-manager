/* eslint-disable no-undef -- used in html */
document.addEventListener("DOMContentLoaded", function () {
  function updatePreview() {
    const domain = document.querySelector("[data-domain]").dataset.domain;
    const service = document.getElementById("service").value.trim() || (typeof record !== "undefined" && record.service ? record.service : "");
    const protocol = document.getElementById("protocol").value;
    const hostname = document.getElementById("hostname").value.trim();
    const target = document.getElementById("target").value.trim();
    const priority = document.getElementById("priority").value || 0;
    const weight = document.getElementById("weight").value || 0;
    const port = document.getElementById("port").value || 0;
    const ttl = document.getElementById("ttl").value;

    // Falls ein Hostname eingegeben wurde, wird er vor der Domain ergänzt.
    const fqdn = hostname ? `${hostname}.${domain}` : domain;
    // Format der Vorschau: _service._protocol.[fqdn] [ttl] IN SRV [priority] [weight] [port] [target]
    document.getElementById("previewRecord").textContent
      = `_${service}._${protocol}.${fqdn} ${ttl} IN SRV ${priority} ${weight} ${port} ${target}`;
  }

  // Alle relevanten Felder lauschen
  document.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", updatePreview);
    el.addEventListener("change", updatePreview);
  });

  updatePreview();
});
