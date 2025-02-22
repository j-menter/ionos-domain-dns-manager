require("dotenv").config();
const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const helmet = require("helmet");
const session = require("express-session");
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "cdn.jsdelivr.net"],
      },
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

// Session und Passport initialisieren
app.use(session({
  secret: "idazfrzVOsUsFstgEVd282)dF(?",
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

// passport
const passport = require("./utils/passportConfig");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(path.join(__dirname, "node_modules", "jquery", "dist"))); // jquery
app.use("/js", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "js"))); // bootstrap
app.use("/css", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "css"))); // bootstrap
app.use("/", express.static(path.join(__dirname, "node_modules", "bootstrap-table", "dist"))); // bootstrap-table
app.use("/font", express.static(path.join(__dirname, "node_modules", "bootstrap-icons", "font"))); // bootstrap-icons

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/", authRoutes); // alle nutzer
app.use("/admin", adminRoutes); // nur admins

app.use((req, res, next) => {
  const err = new Error("Seite nicht gefunden");
  err.status = 404;
  next(err);
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500; // Fallback auf 500
  const message = err.status === 404 ? "Seite nicht gefunden" : (err.message || "Ein unerwarteter Fehler ist aufgetreten");

  console.error(err.stack);

  // Sicherstellen, dass res.render verfügbar ist
  if (typeof res.render !== "function") {
    console.error("Response-Objekt hat keine render-Methode");
    return res.status(status).send(message); // Fallback zu einer einfachen Textantwort
  }

  res.status(status).render("error", {
    user: res.locals.user,
    status: status,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : "", // Stack nur im Entwicklungsmodus anzeigen
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${new Date().toLocaleTimeString()} Server läuft auf Port http://localhost:${PORT}`);
});
