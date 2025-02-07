const express = require("express");
const router = express.Router();

const dnsController = require("../controllers/dnsController");
const authController = require("../controllers/authController");

router.get("/", authController.getFqdn)

router.get("/domain/:domain", authController.getDomainDetails)
router.get("/domain/:domain/createDns", authController.getDnsTable)

router.post("/domain/:domain/delete/:recordId", authController.postDeleteDnsRecord)

//dns record erstellung
router.post("/domain/:domain/createDns/:type", dnsController.postCreateDns)

//dns record ersellung views
router.get("/domain/:domain/createDns/A", dnsController.getCreateDnsA)
router.get("/domain/:domain/createDns/AAAA", dnsController.getCreateDnsAAAA)

router.get("/domain/:domain/createDns/TXT", dnsController.getCreateDnsTXT)

router.get("/doain/:domain/createDns/CNAME", dnsController.getCreateDnsCNAME)


module.exports = router;
