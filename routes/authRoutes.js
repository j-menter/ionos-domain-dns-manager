const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/", authController.getFqdn)

router.get("/domain/:domain", authController.getDomainDetails)
router.get("/domain/:domain/createDns", authController.getDnsTable)

router.post("/domain/:domain/delete/:recordId", authController.postDeleteDnsRecord)

module.exports = router;
