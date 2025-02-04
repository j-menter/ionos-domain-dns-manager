require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();

let ejs = require('ejs');
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "js"))); // bootstrap
app.use("/css", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "css"))); // bootstrap
app.use("/", express.static(path.join(__dirname, "node_modules", "bootstrap-table", "dist"))); // bootstrap-table
app.use("/font", express.static(path.join(__dirname, "node_modules", "bootstrap-icons", "font"))); // bootstrap-icons


const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
app.use("/", authRoutes); // alle nutzer
// app.use("/admin", adminRoutes); // nur admins

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port http://localhost:${PORT}`);
});
