const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/", authController.fqdn)

router.get("/domain/:domain", authController.getDomainDetails)


module.exports = router;
