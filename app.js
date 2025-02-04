require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();

let ejs = require('ejs');
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));



const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
app.use("/", authRoutes); // alle nutzer
// app.use("/admin", adminRoutes); // nur admins

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port http://localhost:${PORT}`);
});
