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
// router.use(isAuthenticated);

router.get('/profile', authController.getProfile);

router.get("/fqdn", authController.getFqdn)

// router.use("/domain/:domain", checkDomainOwnership); // checkt berechtigungen für domain

router.get("/domain/:domain", authController.getDomainDetails)
router.get("/domain/:domain/createDns", dnsController.getDnsTable)

//dns record delete
router.post("/domain/:domain/delete/:recordId", dnsController.postDeleteDnsRecord)

//dns record get create views
router.get("/domain/:domain/createDns/:type", dnsController.getCreateDns)

//dns record post create
router.post("/domain/:domain/createDns/:type", 
  //middleware zur routenerzeugung
  (req, res, next) => {
  const type = req.params.type;
  const handler = dnsController[`postCreateDns${type}`];
  if (handler) {
    return handler(req, res, next);
  } else {
    return next(new Error("Ungültiger Record-Typ"));
  }
});

//dns record get edit views
router.get("/domain/:domain/editDns/:type/:zoneId/:recordId", dnsController.getEditDnsA)

//dns record post edit
router.post("/domain/:domain/editDns/:zoneId/:recordId/:type", 
  //middleware zur routenerzeugung
  (req, res, next) => {
  const type = req.params.type;
  const handler = dnsController[`postEditDns${type}`];
  if (handler) {
    return handler(req, res, next);
  } else {
    return next(new Error("Ungültiger Record-Typ"));
  }
});

module.exports = router;
