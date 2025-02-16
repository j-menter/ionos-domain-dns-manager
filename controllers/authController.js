const { API_GET_DOMAINS } = require("../utils/API_GET_DOMAINS");
const { API_GET_DOMAIN_RECORDS } = require("../utils/API_GET_DOMAIN_RECORDS");
const { API_POST_DELETE_DNS_RECORD } = require("../utils/API_POST_DELETE_DNS_RECORD");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getLogin = (req, res) => {
  res.render("login", { errorMessages: req.flash("error") });
};

exports.getProfile = async (req, res) => {    
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { domains: true }
  });

  res.render('profile', { user });
};

exports.getFqdn = async (req, res) => {
  try {
    // Hole den aktuell eingeloggenen User mitsamt seinen Domains
    const userWithDomains = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { domains: true }
    });

    // Wenn der User nicht existiert (sollte aber nicht der Fall sein, wenn er eingeloggt ist)
    if (!userWithDomains) {
      return res.status(404).send("Benutzer nicht gefunden");
    }

    // Render die View "fqdn" und übergebe nur die Domains des Users
    res.render("fqdn", { domains: userWithDomains.domains });
  } catch (error) {
    console.error("Fehler beim Abrufen der Domains:", error);
    res.status(500).send("Fehler beim Laden der Domains");
  }
};

exports.getDomainDetails = async (req, res) => {
  const domainName = req.params.domain; // DOMAIN aus url
  
  const fqdnId = await API_GET_DOMAINS();
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
