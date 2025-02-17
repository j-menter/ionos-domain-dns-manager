const { API_POST_DNS_RECORDS } = require("../utils/API_POST_DNS_RECORDS");
const { API_GET_DOMAINS } = require("../utils/API_GET_DOMAINS");
const { API_GET_DNS_RECORD } = require("../utils/API_GET_DNS_RECORD");
const { API_UPDATE_DNS_RECORD } = require("../utils/API_UPDATE_DNS_RECORD");
const { API_POST_DELETE_DNS_RECORD } = require("../utils/API_POST_DELETE_DNS_RECORD");
const { getHostname } = require("../utils/getHostname");


exports.getDnsTable = async (req, res) => {

  res.render("dnsTable");
};

exports.postDeleteDnsRecord = async (req, res) => {
  console.log("löschvorgang");
  const domain = req.params.domain;
  const recordId = req.params.recordId;
  const domainZoneId = req.body.domainZoneId;

  console.log("lösche dns eintrag: ", domain, recordId, domainZoneId)

  await API_POST_DELETE_DNS_RECORD(domainZoneId, recordId)


  res.redirect(`/domain/${domain}`);
};

// get create controller
exports.getCreateDns = async (req, res) => {
  const { domain } = req.params;
  let type = req.params.type;
  // type 2 stelle aus url auslesen z.B /dns/A (create)
  if (!type) {
    const parts = req.originalUrl.split("/");
    type = parts[parts.length - 1];
  }
  res.render(`dns/${type}`, { domain });
};

// Post create Controller
exports.postCreateDnsA = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular:
    const { type, hostname, destination, ttl = 300, include_www = false, prio = 0, disabled = false } = req.body;
    
    // Domains abrufen
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) return res.status(404).send("Domain not found");
    const domainId = domainObj.id;
    
    // Record-Name: Wenn Hostname leer oder "@" ist, dann Domain; sonst "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@" )
      ? domain
      : `${hostname.trim()}.${domain}`;
    
    await API_POST_DNS_RECORDS(domainId, domainName, type, destination, ttl, prio, disabled);
    console.log(`A-Record für ${domainName} angelegt.`);
    
    // Optional: Wenn include_www aktiviert ist, zusätzlichen Record anlegen
    if (include_www === "true") {
      const wwwRecordName = `www.${domainName}`;
      await API_POST_DNS_RECORDS(domainId, wwwRecordName, type, destination, ttl, prio, disabled);
      console.log(`A-Record für ${wwwRecordName} angelegt.`);
    }
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des A-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postCreateDnsAAAA = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular:
    // Beachte: "destination" enthält hier die IPv6-Adresse.
    const { type, hostname, destination, ttl = 300, include_www = false, disabled = false } = req.body;
    
    // Domains über die API abrufen
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) return res.status(404).send("Domain not found");
    const domainId = domainObj.id;
    
    // Record-Name: Falls der Hostname leer oder "@" ist, wird die Domain verwendet, sonst "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@" )
      ? domain
      : `${hostname.trim()}.${domain}`;
    
    // Für AAAA-Records übergeben wir für prio den Wert null, da dieser Typ keine Priorität benötigt.
    await API_POST_DNS_RECORDS(domainId, domainName, type, destination, ttl, null, disabled);
    console.log(`AAAA-Record für ${domainName} angelegt.`);
    
    // Optional: Wenn include_www aktiviert ist, wird ein zusätzlicher Record für "www.domain" angelegt.
    if (include_www === "true") {
      const wwwRecordName = `www.${domainName}`;
      await API_POST_DNS_RECORDS(domainId, wwwRecordName, type, destination, ttl, null, disabled);
      console.log(`AAAA-Record für ${wwwRecordName} angelegt.`);
    }
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des AAAA-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};


// get edit controller
exports.getEditDnsA = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    // record enthält z.B. Felder wie hostname, destination, ttl, prio, disabled, etc.
    record.zoneId = zoneId;
    record.recordId = recordId;
    console.log(  "record", record)
    res.render("dns/A", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des A-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditDnsAAAA = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    record.zoneId = zoneId;
    record.recordId = recordId;
    console.log("Record (AAAA) geladen:", record);
    res.render("dns/AAAA", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des AAAA‑Records:", error);
    res.status(500).send("Internal Server Error");
  }
};


// post edit Controller
exports.postEditDnsA = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    // Aus dem Formular erhaltene Werte
    const { type, hostname, destination, ttl, include_www, prio, disabled } = req.body;

    // Domains über die API abrufen und passende Domain finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;


    // Nehme den neuen Hostnamen aus dem Formular und verwende, falls leer, den bisherigen Wert
    const newHostname = (hostname && hostname.trim() !== "") ? hostname.trim() : hostname;

    // Verwende getHostname, um den Subdomain-Teil zu extrahieren
    const subdomain = getHostname(newHostname, domain);

    // Damit wird sichergestellt, dass, wenn subdomain '@' ist, der Record-Name gleich der Domain bleibt
    const domainName = subdomain === '@' ? domain : `${subdomain}.${domain}`;

    // Aktualisiere den Record
    await API_UPDATE_DNS_RECORD(zoneId, recordId, destination, ttl, prio, disabled) ;
    console.log(`A-Record ${recordId} für ${domainName} aktualisiert.`);

    // Optional: Bei aktivierter include_www-Checkbox ggf. einen zusätzlichen Record aktualisieren
    if (include_www === "true") {
      const wwwRecordName = `www.${domainName}`;
      await API_POST_DNS_RECORDS(domainId, wwwRecordName, type, destination, ttl, prio, disabled);
      console.log(`A-Record für ${wwwRecordName} angelegt.`);
    } else if (include_www === "false") {
      // Wenn include_www deaktiviert ist, dann den www-Record löschen
      const wwwRecordName = `www.${domainName}`;
      const wwwRecord = await API_GET_DNS_RECORD(zoneId, wwwRecordName);
      if (wwwRecord) {
        await API_POST_DELETE_DNS_RECORD(zoneId, wwwRecord.id);
        console.log(`A-Record für ${wwwRecordName} gelöscht.`);
      }
    }

    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des A-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditDnsAAAA = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    // Für AAAA-Records gibt es keine Priorität (prio), also nicht benötigt
    const { type, hostname, destination, ttl, include_www, disabled } = req.body;
    
    // Hole zunächst die Domain-Daten, um die Domain-ID zu erhalten
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Hole den existierenden Record, um den ursprünglichen Hostnamen zu verwenden, falls der Benutzer das Feld leert.
    const existingRecord = await API_GET_DNS_RECORD(zoneId, recordId);
    
    // Nutze den neuen Hostnamen, falls eingegeben, ansonsten den bisherigen
    const inputHostname = (hostname && hostname.trim() !== "") ? hostname.trim() : existingRecord.name;
    // Verwende die Utility-Funktion, um den Subdomain-Teil zu extrahieren.
    const subdomain = getHostname(inputHostname, domain);
    // Wenn subdomain "@" ist, bleibt der Record-Name die Root-Domain, ansonsten "subdomain.domain"
    const domainName = subdomain === '@' ? domain : `${subdomain}.${domain}`;
    
    // Aktualisiere den Record. Für AAAA-Records wird prio als null übergeben.
    await API_UPDATE_DNS_RECORD(zoneId, recordId, destination, ttl, null, disabled);
    console.log(`AAAA-Record ${recordId} für ${domainName} aktualisiert.`);
    
    // Optionale Logik: Falls include_www aktiviert ist, lege einen zusätzlichen Record für "www" an,
    // andernfalls ggf. lösche den www‑Record.
    if (include_www === "true") {
      const wwwRecordName = `www.${domainName}`;
      await API_POST_DNS_RECORDS(domainId, wwwRecordName, type, destination, ttl, null, disabled);
      console.log(`AAAA-Record für ${wwwRecordName} angelegt.`);
    } else if (include_www === "false") {
      // Falls include_www deaktiviert ist, kann ein vorhandener www‑Record gelöscht werden (falls vorhanden)
      const wwwRecordName = `www.${domainName}`;
      const wwwRecord = await API_GET_DNS_RECORD(zoneId, wwwRecordName);
      if (wwwRecord) {
        await API_POST_DELETE_DNS_RECORD(zoneId, wwwRecord.id);
        console.log(`AAAA-Record für ${wwwRecordName} gelöscht.`);
      }
    }
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des AAAA‑Records:", error);
    res.status(500).send("Internal Server Error");
  }
};