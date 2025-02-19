// routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");

// Alle Admin-Routen benötigen Authentifizierung und Adminrechte
process.env.NODE_ENV === "development" ? "" : router.use(isAuthenticated, isAdmin);

// Nutzerliste anzeigen
router.get("/", adminController.getListUsers);

// Formular zum Erstellen eines neuen Nutzers anzeigen
router.get("/users/create", adminController.getCreateUserForm);
router.get("/users/edit/:id", adminController.getEditUserForm);
router.post("/users/edit/:id", adminController.postEditUser);

// Neuen Nutzer anlegen
router.post("/users/create", adminController.postCreateUser);

module.exports = router;
