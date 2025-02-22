/* eslint-disable no-undef -- used in html */
document.addEventListener("DOMContentLoaded", async () => {
  // Lese die Domain aus dem Data-Attribut und speichere sie global
  window.domainName = document.querySelector("[data-domain]").dataset.domain;

  // Daten per Fetch laden
  const response = await fetch(`/api/v1/domain/${window.domainName}/records`);
  const { dnsRecords, subdomains, domainZoneId } = await response.json();

  // Mache domainZoneId global zugänglich
  window.domainZoneId = domainZoneId;

  console.log("Domain Name im Frontend geladen:", window.domainName);
  console.log("Domain Zone ID im Frontend geladen:", window.domainZoneId);
  console.log("DNS Records im Frontend geladen:", dnsRecords);
  console.log("Subdomains im Frontend geladen:", subdomains);

  // Globale Formatter-Funktion definieren
  /* eslint-disable no-unused-vars -- used by bootstrap-table */
  window.actionFormatter = function (value, row, index) {
    return `
      <button type="button" 
              class="btn btn-danger btn-sm mb-2" 
              data-bs-toggle="modal" 
              data-bs-target="#deleteModal"
              data-id="${row.id}"
              data-name="${row.name}"
              data-type="${row.type}"
              data-content="${row.content}"
              data-changedate="${new Date(row.changeDate).toLocaleString()}"
              data-ttl="${row.ttl}"
              data-disabled="${row.disabled ? "Ja" : "Nein"}">
        Löschen
      </button>
      <a href="/domain/${window.domainName}/editDns/${row.type}/${window.domainZoneId}/${row.id}" class="btn btn-warning btn-sm mb-2">
        Bearbeiten
      </a>
    `;
  };

  // Initialisiere die Bootstrap Table, falls noch nicht geschehen
  const dnsTable = $("#dnsTable");
  if (!dnsTable.data("bootstrap.table")) {
    console.log("Versuche, Bootstrap Table zu initialisieren...");
    dnsTable.bootstrapTable({
      data: dnsRecords,
      filterControl: true,
    });
    console.log("Bootstrap Table erfolgreich initialisiert.");
  }

  // Restlicher Code (z.B. Subdomain-Filter, Modal-Event-Listener, etc.)
  const subdomainFilter = document.getElementById("subdomainFilter");
  if (subdomainFilter) {
    subdomainFilter.addEventListener("change", function () {
      const selectedSubdomain = this.value ? this.value.toLowerCase() : "";
      console.log("Ausgewählte Subdomain:", selectedSubdomain);

      let filteredRecords = dnsRecords;
      if (selectedSubdomain !== "") {
        filteredRecords = dnsRecords.filter(record => record.name.toLowerCase().includes(selectedSubdomain));
      }
      dnsTable.bootstrapTable("load", filteredRecords);
    });
  }

  // Modal befüllen
  var deleteModal = document.getElementById("deleteModal");
  deleteModal.addEventListener("show.bs.modal", function (event) {
    var button = event.relatedTarget;
    var id = button.getAttribute("data-id");
    var name = button.getAttribute("data-name");
    var type = button.getAttribute("data-type");
    var content = button.getAttribute("data-content");
    var changeDate = button.getAttribute("data-changedate");
    var ttl = button.getAttribute("data-ttl");
    var disabled = button.getAttribute("data-disabled");

    document.getElementById("modalRecordName").textContent = name;
    document.getElementById("modalRecordType").textContent = type;
    document.getElementById("modalRecordContent").textContent = content;
    document.getElementById("modalRecordChangeDate").textContent = changeDate;
    document.getElementById("modalRecordTTL").textContent = ttl;
    document.getElementById("modalRecordDisabled").textContent = disabled;

    document.getElementById("deleteForm").action = `/domain/${window.domainName}/delete/${id}`;
  });
});
