const { API_POST_DNS_RECORDS } = require("../utils/API_POST_DNS_RECORDS");
const { API_GET_DOMAINS } = require("../utils/API_GET_DOMAINS");

exports.getcreateDnsA = (req, res) => {
  
    res.render("createDns/A", { domain: req.params.domain });
};

exports.postcreateDnsA = async (req, res) => {
  try {
    const domain = req.params.domain;
    console.log("body:", req.body);

    const type = "A";
    const { hostname = "1.1.1.1", destination, ttl = 300, include_www = false, prio = 0, disabled = false } = req.body;


    // Domains von der API abrufen (z. B. [{name: 'handyatelier.de', id: '...'}, ...])
    const domains = await API_GET_DOMAINS();

    // Passenden Domain-Eintrag anhand des Namens finden
    const domainObj = domains.find(d => d.name === domain);
    if (!domainObj) {
      console.error("Domain nicht gefunden:", domain);
      return res.status(404).send("Domain not found");
    }
    const domainId = domainObj.id;
    console.log("domainZoneID gefunden", domainId)

    // Record-Name bestimmen:
    // - Wenn der eingegebene Hostname "@" (oder leer) ist, wird der Recordname zur Domain
    // - Andernfalls: "hostname.domain"
    const domainName = (hostname.trim() === "@" || hostname.trim() === "")
      ? domain
      : `${hostname.trim()}.${domain}`;

    console.log("domainName", domainName)
    const content = destination; // z.B IP-Adresse

    // DNS Record anlegen
    await API_POST_DNS_RECORDS(domainId, domainName, type, content, ttl, prio, disabled);
    console.log(`DNS Record für ${domainName} angelegt.`);

    // Optional: Wenn die Checkbox "include_www" auf "true" gesetzt ist,
    // wird ein zusätzlicher Record für "www.domain" angelegt.
    if (include_www === "true") {
      const wwwRecordName = `www.${domainName}`;
      await API_POST_DNS_RECORDS(domainId, domainName, type, content, ttl, prio, disabled);
      console.log(`DNS Record für ${wwwRecordName} angelegt.`);
    }

    // Nach erfolgreicher Erstellung zur Domain-Seite umleiten
    res.redirect(`/domain/${domain}`);
  } catch (error) {
    console.error("Fehler beim Anlegen des DNS Records:", error);
    res.status(500).send("Internal Server Error");
  }
};
