const express = require("express");
const router = express.Router();

const dnsController = require("../controllers/dnsController");
const authController = require("../controllers/authController");

router.get("/", authController.getFqdn)

router.get("/domain/:domain", authController.getDomainDetails)
router.get("/domain/:domain/createDns", authController.getDnsTable)

router.post("/domain/:domain/delete/:recordId", authController.postDeleteDnsRecord)

//ab hier dns record erstellung
router.get("/domain/:domain/createDns/A", dnsController.getCreateDnsA)


router.get("/domain/:domain/createDns/AAAA", dnsController.getCreateDnsAAAA)
router.post("/domain/:domain/createDns/AAAA", dnsController.postCreateDnsAAAA)
module.exports = router;
