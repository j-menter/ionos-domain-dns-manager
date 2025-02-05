const { API_GET_DOMAINS } = require("../utils/API_GET_DOMAINS");
const { API_GET_DOMAIN_RECORDS } = require("../utils/API_GET_DOMAIN_RECORDS");

exports.getFqdn = async (req, res) => {
  try {
      // Abrufen der DNS-Zonen
      const response = await API_GET_DOMAINS();
      console.log("response ",response)
      
      // Extrahieren der relevanten Domain-Daten
      const domains = response.map(domain => ({
            name: domain.name,
            id: domain.id,
        }));

        console.log("domains gemapped: ", domains)
      // Rendern der EJS-Vorlage mit den Domain-Daten
      res.render("fqdn", { domains });
  } catch (error) {
      console.error("Fehler beim Abrufen der DNS-Zonen:", error);
      res.status(500).send("Fehler beim Laden der Domains");
  }
};

exports.getDomainDetails = async (req, res) => {
  const domainName = req.params.domain; // DOMAIN aus url
  
  const fqdnId = await API_GET_DOMAINS();
  console.log("fqdn und Id: ",fqdnId)

  const domainEntry = fqdnId.find(domain => domain.name === domainName);

    if (!domainEntry) {
        console.error("Domain nicht gefunden:", domainName);
        return res.status(404).send("Domain nicht gefunden");
    }

    const domainId = domainEntry.id;
    console.log("Gefundene Domain-ID:", domainId);
  
  // Neues Request
  const dnsRecordsResponse = await API_GET_DOMAIN_RECORDS(domainId);
  const dnsRecords = Array.isArray(dnsRecordsResponse.records) ? dnsRecordsResponse.records : [];

  console.log("--------------")
  console.log("dnRecrods ", dnsRecords)
  console.log("--------------")

     // Filtern der relevanten Subdomains
     const subdomains = [...new Set(
      dnsRecords
          .map(record => record.name)
          .filter(name => {
              const isSubdomain = name !== domainName && name.endsWith(`.${domainName}`);
              return isSubdomain &&
                     !name.startsWith("_") &&
                     !name.includes("www") &&
                     !name.includes("autodiscover") &&
                     !name.includes("domainkey") &&
                     !name.includes("bimi");
          })
  )];

  console.log("subdomains gefiltert: ", subdomains)

  res.render("subdomains", { dnsRecords, domainName, subdomains });
};


exports.getDomainDNS = (req, res) => {


  // abfrage aller dns einträge der angefragten domain

  res.render("dns");
};

exports.getDnsTable= async (req, res) => {

  res.render("dnsTable");
};