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

exports.postCreateDnsCAA = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular
    const { type, hostname, value, flag, caType, ttl = 3600, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@" )
      ? domain
      : `${hostname.trim()}.${domain}`;
      
    // Content zusammenbauen: Flag, caType und den Wert in Anführungszeichen
    const content = `${flag} ${caType} "${value}"`;
    
    // CAA Record anlegen
    await API_POST_DNS_RECORDS(domainId, domainName, type, content, ttl, null, disabled);
    console.log(`CAA Record für ${domainName} angelegt.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des CAA-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postCreateDnsCNAME = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular
    const { type, hostname, destination, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@" )
      ? domain
      : `${hostname.trim()}.${domain}`;
      
    
    // CAA Record anlegen
    await API_POST_DNS_RECORDS(domainId, domainName, type, destination, ttl, null, disabled);
    console.log(`CAA Record für ${domainName} angelegt.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des CAA-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postCreateDnsMX = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular
    const { type, hostname, destination, priority, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
    
    // Inhalt des MX-Records zusammensetzen: Priority und Destination
    const content = `${priority} ${destination}`;
      
    // MX Record anlegen
    await API_POST_DNS_RECORDS(domainId, domainName, type, content, ttl, null, disabled);
    console.log(`MX Record für ${domainName} angelegt.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des MX-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postCreateDnsNS = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular
    const { type, hostname, destination, priority, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
          
    // MX Record anlegen
    await API_POST_DNS_RECORDS(domainId, domainName, type, destination, ttl, null, disabled);
    console.log(`NS Record für ${domainName} angelegt.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des NS-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};


exports.postCreateDnsSRV = async (req, res) => {
  try {
    const { type, domain } = req.params;
    let { service, protocol, hostname, destination, priority, weight, port, ttl, disabled = false } = req.body;
    console.log('SRV Body:', req.body);

    // Numerische Felder in Zahlen umwandeln
    const parsedPriority = parseInt(priority, 10);
    const parsedWeight = parseInt(weight, 10);
    const parsedPort = parseInt(port, 10);
    let parsedTtl = parseInt(ttl, 10);
    console.log("parsed ttl", parsedTtl)

    // Domains abrufen und den passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error('Domain nicht gefunden:', domain);
      return res.status(404).send('Domain not found');
    }
    const domainId = domainObj.id;

    // Bestimme den Record-Namen: Falls hostname leer oder "@" wird die Domain verwendet,
    // ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === '@')
      ? domain
      : `${hostname.trim()}.${domain}`;

    // Service und Protokoll richtig formatieren
    const formattedService = service.startsWith('_') ? service : `_${service}`;
    const formattedProtocol = protocol.startsWith('_') ? protocol.toLowerCase() : `_${protocol.toLowerCase()}`;

    const recordName = `${formattedService}.${formattedProtocol}.${domainName}`;

    // Für SRV-Einträge enthält das Content-Feld "weight port destination"
    // Oft wird beim Ziel (destination) ein absoluter Domainname (FQDN) benötigt,
    // also ggf. mit abschließendem Punkt.
    const target = destination.endsWith('.') ? destination : `${destination}.`;
    const recordContent = `${parsedWeight} ${parsedPort} ${target}`;

    console.log('SRV Record Name:', recordName, '| Content:', recordContent);

    //async function API_POST_DNS_RECORDS(domainId, domainName, type, content, ttl, prio, disabled) {

    await API_POST_DNS_RECORDS(domainId, recordName, type, recordContent, parsedTtl, parsedPriority, disabled);
    console.log(`SRV Record für ${domainName} angelegt.`);
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error('Fehler beim Anlegen des SRV-Records:', error);
    res.status(500).send('Internal Server Error');
  }
};




exports.postCreateDnsIONOS_SPF_TXT = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular – beachte: hier heißt das Feld jetzt spfValue!
    const { type, hostname, spfValue, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
      
    // TXT Record (SPF) anlegen – hier wird der SPF-Wert als content übergeben
    await API_POST_DNS_RECORDS(domainId, domainName, type, spfValue, ttl, null, disabled);
    console.log(`IONOS_SPF_TXT Record für ${domainName} angelegt.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des IONOS_SPF_TXT-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};



exports.postCreateDnsTXT = async (req, res) => {
  try {
    const { domain } = req.params;
    // Felder aus dem Formular – beachte: hier heißt das Feld jetzt spfValue!
    const { type, hostname, destination, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
      
    // TXT Record (SPF) anlegen – hier wird der SPF-Wert als content übergeben
    await API_POST_DNS_RECORDS(domainId, domainName, type, spfValue, ttl, null, disabled);
    console.log(`IONOS_SPF_TXT Record für ${domainName} angelegt.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des IONOS_SPF_TXT-Records:", error);
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
    console.error("Fehler beim Laden des AAAA-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditDnsCAA = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    record.zoneId = zoneId;
    record.recordId = recordId;
    
    // Extrahiere Flag, CA-Type und Value aus record.content
    // Erwartetes Format: "<flag> <caType> "<value>""
    if (record.content) {
      const regex = /^(\d+)\s+(\S+)\s+"(.+)"$/;
      const match = record.content.match(regex);
      if (match) {
        record.flag = match[1];    // z.B. "1"
        record.caType = match[2];  // z.B. "issuewild"
        record.value = match[3];   // z.B. "caa@test.de"
      } else {
        console.warn("Content-Format passt nicht:", record.content);
      }
    }
    
    console.log("Record (CAA) geladen:", record);
    res.render("dns/CAA", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des CAA-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditDnsCNAME = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    // record enthält z.B. Felder wie hostname, destination, ttl, prio, disabled, etc.
    record.zoneId = zoneId;
    record.recordId = recordId;
    console.log(  "record", record)
    res.render("dns/CNAME", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des CNAME-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditDnsMX = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    record.priority = record.prio;
    

    console.log("record parts", record.prio , " und ", record.content)
    
    record.zoneId = zoneId;
    record.recordId = recordId;
    console.log("record", record);
    res.render("dns/MX", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des MX-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditDnsNS = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    record.zoneId = zoneId;
    record.recordId = recordId;
    console.log("Record (NS) geladen:", record);
    res.render("dns/NS", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des NS-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditDnsSRV = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    record.zoneId = zoneId;
    record.recordId = recordId;

    // --- Aufteilung von record.name ---
    // Erwartetes Format: _service._protocol.[hostname].domain
    // Zuerst den Domainteil (".domain") entfernen:
    const domainSuffix = `.${domain}`;
    let nameWithoutDomain = record.name;
    if (record.name.endsWith(domainSuffix)) {
      nameWithoutDomain = record.name.slice(0, -domainSuffix.length);
    }
    // Aufteilen: z. B. "_aaa._udp.aaa" -> ["_aaa", "_udp", "aaa"]
    const nameParts = nameWithoutDomain.split('.');
    // Service: "_aaa" → "aaa"
    const service = nameParts[0] ? nameParts[0].replace(/^_/, '') : '';
    // Protokoll: "_udp" → "UDP" (für die Auswahl wird meist Großschrift erwartet)
    const protocol = nameParts[1] ? nameParts[1].replace(/^_/, '').toUpperCase() : '';
    // Hostname: Falls vorhanden (alles, was danach kommt); ansonsten leer
    const hostname = (nameParts.length > 2) ? nameParts.slice(2).join('.') : '';

    // --- Aufteilung von record.content ---
    // Erwartetes Format: "weight port destination"
    // Z. B.: "33 333 aaa.de." → Gewicht: "33", Port: "333", Destination: "aaa.de" (ohne abschließenden Punkt)
    const contentParts = record.content.split(' ');
    const weight = contentParts[0] || '';
    const port = contentParts[1] || '';
    let destination = contentParts.slice(2).join(' ') || '';
    if (destination.endsWith('.')) {
      destination = destination.slice(0, -1);
    }

    // --- Für die Editiermaske die Felder richtig zuordnen ---
    // Im Formular soll in "Service" nur der Service (ohne führenden Unterstrich) stehen.
    // Im "Protokoll" soll beispielsweise "UDP" angezeigt werden.
    // Das "Hostname"-Feld soll nur den Hostnamen enthalten (also z. B. "aaa").
    // Im "Zeigt auf"-Feld (destination) soll nur die Ziel-Domain stehen (z. B. "aaa.de").
    record.service = service;
    record.protocol = protocol;
    // Damit der Helper getHostname() im Template funktioniert, setzen wir:
    record.rootName = domain; // z. B. "handyatelier.de"
    record.name = hostname;   // nur der Hostname, z. B. "aaa"
    // Überschreiben des Content-Feldes: Hier soll nur noch die Destination stehen
    record.content = destination;
    // Gewicht und Port separat übergeben:
    record.weight = weight;
    record.port = port;
    // priority, ttl und disabled bleiben unverändert (werden direkt aus der API übernommen)

    console.log("Record (SRV) geladen:", record);
    res.render("dns/SRV", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des SRV-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};





exports.getEditDnsTXT = async (req, res) => {
  try {
    const { domain, recordId, zoneId } = req.params;
    const record = await API_GET_DNS_RECORD(zoneId, recordId);
    // record enthält z.B. Felder wie hostname, destination, ttl, prio, disabled, etc.
    record.zoneId = zoneId;
    record.recordId = recordId;
    console.log(  "record", record)
    res.render("dns/TXT", { domain, record, getHostname });
  } catch (error) {
    console.error("Fehler beim Laden des TXT-Records:", error);
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
    console.error("Fehler beim Aktualisieren des AAAA-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditDnsCAA = async (req, res) => {
  try {
    // Hole domain, recordId und zoneId aus den URL-Parametern
    const { domain, recordId, zoneId } = req.params;
    // Felder aus dem Formular
    const { type, hostname, value, flag, caType, ttl = 3600, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden (extra nicht aus url)
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
      
    // Content zusammenbauen: Flag, caType und den Wert in Anführungszeichen
    const content = `${flag} ${caType} "${value}"`;
    
    await API_UPDATE_DNS_RECORD(domainId, recordId, content, ttl, null, disabled);

    console.log(`CAA Record für ${domainName} aktualisiert.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des CAA-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditDnsCNAME = async (req, res) => {
  try {
    // Hole domain, recordId und zoneId aus den URL-Parametern
    const { domain, recordId, zoneId } = req.params;
    // Felder aus dem Formular
    const { type, hostname, destination, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
      
    // CNAME Record aktualisieren (hier wird davon ausgegangen, dass es eine API-Methode zum Updaten gibt)
    await API_UPDATE_DNS_RECORD(domainId, recordId,destination, ttl, null, disabled);
    console.log(`CNAME Record für ${domainName} aktualisiert.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des CNAME-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditDnsMX = async (req, res) => {
  try {
    // Hole domain, recordId und zoneId aus den URL-Parametern
    const { domain, recordId, zoneId } = req.params;
    // Felder aus dem Formular
    const { type, hostname, destination, priority, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
    
    // Inhalt des MX-Records zusammensetzen: Priority und Destination
      
    // MX-Record aktualisieren (hier wird davon ausgegangen, dass es eine API-Methode zum Updaten gibt)
    await API_UPDATE_DNS_RECORD(domainId, recordId, destination, ttl, priority, disabled);

    console.log(`MX Record für ${domainName} aktualisiert.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des MX-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditDnsNS = async (req, res) => {
  try {
    // Hole domain, recordId und zoneId aus den URL-Parametern
    const { domain, recordId, zoneId } = req.params;
    // Felder aus dem Formular
    const { type, hostname, destination, priority, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
          
    // MX-Record aktualisieren (hier wird davon ausgegangen, dass es eine API-Methode zum Updaten gibt)
    await API_UPDATE_DNS_RECORD(domainId, recordId, destination, ttl, null, disabled);


    console.log(`NS Record für ${domainName} aktualisiert.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des NS-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditDnsSRV = async (req, res) => {
  try {
    // Hole domain, recordId und zoneId aus den URL-Parametern
    const { domain, recordId, zoneId } = req.params;
    // Felder aus dem Formular (Service und Protocol müssen jetzt mitübertragen werden)
    const { type, service, protocol, hostname, destination, priority, weight, port, ttl, disabled = false } = req.body;

    // Numerische Felder in Zahlen umwandeln
    const parsedPriority = parseInt(priority, 10);
    const parsedWeight   = parseInt(weight, 10);
    const parsedPort     = parseInt(port, 10);
    const parsedTtl      = parseInt(ttl, 10);

    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;

    // Bestimme den FQDN: Falls hostname leer oder "@" ist, wird die Domain verwendet, ansonsten "hostname.domain"
    const fqdn = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;

    // Service und Protokoll richtig formatieren:
    // - Service: führender Unterstrich (z.B. _aaa)
    // - Protocol: führender Unterstrich und in Kleinbuchstaben (z.B. _udp)
    const formattedService  = service.startsWith('_') ? service : `_${service}`;
    const formattedProtocol = protocol.startsWith('_') ? protocol.toLowerCase() : `_${protocol.toLowerCase()}`;

    // Zusammenbau des Record-Namens: _service._protocol.fqdn
    const recordName = `${formattedService}.${formattedProtocol}.${fqdn}`;

    // Destination: sicherstellen, dass ein abschließender Punkt vorhanden ist (FQDN)
    const target = destination.endsWith('.') ? destination : `${destination}.`;

    // Zusammenbau des Content-Feldes für SRV-Einträge: "weight port destination"
    const recordContent = `${parsedWeight} ${parsedPort} ${target}`;

    // async function API_UPDATE_DNS_RECORD(zoneId, recordId, destination, ttl, prio, disabled, hostname) {

    await API_UPDATE_DNS_RECORD(domainId, recordId, recordContent, parsedTtl, parsedPriority, disabled, recordName);

    console.log(`SRV Record für ${fqdn} aktualisiert.`);
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des SRV-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};


// TXT & SPF & IONOS SPF
exports.postEditDnsTXT = async (req, res) => {
  try {
    // Hole domain, recordId und zoneId aus den URL-Parametern
    const { domain, recordId, zoneId } = req.params;
    // Felder aus dem Formular
    const { type, hostname, destination, ttl, disabled = false } = req.body;
    
    // Domains abrufen und passenden Domain-Eintrag finden
    const domains = await API_GET_DOMAINS();
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    
    // Record-Name: Wenn hostname leer oder "@" ist, dann die Domain, ansonsten "hostname.domain"
    const domainName = (!hostname || hostname.trim() === "@")
      ? domain
      : `${hostname.trim()}.${domain}`;
      
    // CNAME Record aktualisieren (hier wird davon ausgegangen, dass es eine API-Methode zum Updaten gibt)
    await API_UPDATE_DNS_RECORD(domainId, recordId,destination, ttl, null, disabled);
    console.log(`TXT Record für ${domainName} aktualisiert.`);
    
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des TXT-Records:", error);
    res.status(500).send("Internal Server Error");
  }
};
