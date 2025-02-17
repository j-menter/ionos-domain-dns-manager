const express = require("express");
const router = express.Router();
const passport = require("passport");

const dnsController = require("../controllers/dnsController");
const authController = require("../controllers/authController");

const isAuthenticated = require("../middleware/isAuthenticated");
const checkDomainOwnership = require("../middleware/checkDomainOwnership");

router.get("/", authController.getLogin)
router.post("/login", passport.authenticate("local", {
  successRedirect: "/fqdn",
  failureRedirect: "/",
  failureFlash: "Ungültige Anmeldedaten",
}));

router.get('/logout', (req, res, next) => {
  req.logout(function(err) { // Beachte: In neueren Passport-Versionen wird ein Callback benötigt
    if (err) { return next(err); }
    res.redirect('/'); // Leite nach dem Logout weiter
  });
});

// Hier wird die Middleware verwendet
router.use(isAuthenticated);

router.get('/profile', authController.getProfile);

router.get("/fqdn", authController.getFqdn)

router.use("/domain/:domain", checkDomainOwnership); // checkt berechtigungen für domain

router.get("/domain/:domain", authController.getDomainDetails)
router.get("/domain/:domain/createDns", authController.getDnsTable)

router.post("/domain/:domain/delete/:recordId", authController.postDeleteDnsRecord)

//dns record erstellung
router.post("/domain/:domain/createDns/:type", dnsController.postCreateDns)

//dns record ersellung views
router.get("/domain/:domain/createDns/A", dnsController.getCreateDnsA)
router.get("/domain/:domain/createDns/AAAA", dnsController.getCreateDnsAAAA)

router.get("/domain/:domain/createDns/TXT", dnsController.getCreateDnsTXT)
router.get("/domain/:domain/editDns/:zoneId/:recordId", dnsController.getEditDns)

router.get("/domain/:domain/createDns/CNAME", dnsController.getCreateDnsCNAME)

router.get("/domain/:domain/createDns/CAA", dnsController.getCreateDnsCAA)

router.get("/domain/:domain/createDns/NS", dnsController.getCreateDnsNS)
router.get("/domain/:domain/createDns/SPF", dnsController.getCreateDnsSPF)
router.get("/domain/:domain/createDns/MX", dnsController.getCreateDnsMX)

router.post("/domain/:domain/editDns/:zoneId/:recordId", dnsController.postEditDns)

router.get("/domain/:domain/createDns/SRV", dnsController.getCreateDnsSRV)



module.exports = router;
