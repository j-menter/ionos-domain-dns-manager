const { API_GET_DOMAINS } = require("../utils/API_GET_DOMAINS");
const { API_GET_DOMAIN_RECORDS } = require("../utils/API_GET_DOMAIN_RECORDS");
const { API_POST_DNS_RECORDS } = require("../utils/API_POST_DNS_RECORDS");
const { API_POST_DELETE_DNS_RECORD } = require("../utils/API_POST_DELETE_DNS_RECORD");

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

    const domainZoneId = domainEntry.id;
    
    // Neues Request
    const dnsRecordsResponse = await API_GET_DOMAIN_RECORDS(domainZoneId);
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
    console.log("Gefundene domain Zone-ID:", domainZoneId);
    
    res.render("subdomains", { dnsRecords, domainName, subdomains, domainZoneId });
  };
  

exports.getDomainDNS = (req, res) => {


  // abfrage aller dns einträge der angefragten domain

  res.render("dns");
};

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
