// controllers/adminController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Liste aller Nutzer (inkl. zugewiesener Domains)
exports.getListUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { domains: true }
        });
        res.render('admin/users', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Abrufen der Nutzer");
    }
};

// Formular anzeigen, um einen neuen Nutzer zu erstellen
exports.getCreateUserForm = async (req, res) => {
    try {
        // Hole alle Domains (die z. B. über die IONOS API aktualisiert und in der DB gespeichert wurden)
        const domains = await prisma.domain.findMany();
        res.render('admin/createUser', { error: null, domains });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Laden des Formulars");
    }
};

// Neuen Nutzer anlegen und ausgewählte Domains zuweisen
exports.postCreateUser = async (req, res) => {
    const { benutzername, email, password, domainIds, isAdmin } = req.body;
    try {
        // Prüfen, ob der Nutzer bereits existiert
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser) {
            // Falls Domains nicht neu geladen wurden, hole sie erneut
            const domains = await prisma.domain.findMany();
            return res.render('admin/createUser', { error: 'Diese Email existiert bereits', domains });
        }
        // Passwort hashen
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        // Nutzer erstellen und ggf. Domains verbinden (domainIds kann ein einzelner Wert oder ein Array sein)
        await prisma.user.create({
            data: {
                benutzername,
                email,
                passwordHash,
                isAdmin: isAdmin === 'on', // Checkbox-Wert
                domains: {
                    connect: domainIds
                      ? (Array.isArray(domainIds)
                         ? domainIds.map(id => ({ id: parseInt(id) }))
                         : [{ id: parseInt(domainIds) }])
                      : []
                }
            }
        });
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Fehler beim Erstellen des Nutzers:', error);
        const domains = await prisma.domain.findMany();
        res.render('admin/createUser', { error: 'Fehler beim Erstellen des Nutzers', domains });
    }
};

exports.getEditUserForm = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { domains: true }
        });
        const domains = await prisma.domain.findMany();
        res.render(`admin/editUser`, { user, domains });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Laden des Formulars");
    }
};

