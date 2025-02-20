# IONOS Domain DNS Manager

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## Übersicht

Der **IONOS Domain DNS Manager** ist ein Open-Source-Tool zur Verwaltung von DNS-Einträgen, das alle Operationen abbildet, die auch in der IONOS-Verwaltung möglich sind.


## Features
- **Umfangreiche DNS-Verwaltung:** Unterstützt sämtliche gängige DNS-Eintragstypen. (Wie IONOS selbst)
- **Benutzer-Authentifizierung:** Login und Session-Management via Passport.
- **Drittzugriff:** Erteile anderen Nutzern spezifische Zugriffsrechte auf DNS-Einstellungen.
- **Responsive UI:** Moderne, ansprechende Oberfläche dank Bootstrap.
- **Sicherheitsfeatures:** HTTP-Header-Härtung mit Helmet und weitere Best Practices.
- **Automatisierte API-Integration:** Kommunikation mit der IONOS API zur zuverlässigen Steuerung der DNS-Operationen.
- **Admin-Panel** Nutzer- und Rechteverwaltung für Admins.
- **Dark-Mode** Augen statt IONOS.

## Technologie-Stack

- **Backend:** Node.js, Express
- **Datenbank & ORM:** Prisma (optional, je nach Konfiguration)
- **Authentifizierung:** Passport
- **Frontend:** EJS Templates, Bootstrap, jQuery
- **Sicherheit:** Helmet
- **Versionskontrolle:** Git

## Installation

### Voraussetzungen

- [Node.js (LTS empfohlen)](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Schritte
1. **IONOS-API-KEY**
    
    Gehe zum [IONOS Developer Portal](https://developer.hosting.ionos.de/) Aktiviere die API und erstell einen API-key.

1. **Repository klonen:**

   ```bash
   git clone https://github.com/j-menter/ionos-domain-dns-manager.git
   cd ionos-domain-dns-manager
   ```
    Abhängigkeiten installieren:

    npm install

    Bennene eine .env.template zu .env um und gibt korrekte variablen an:

        PORT=3000
        NODE_ENV=development
        SESSION_SECRET=dein_session_secret
        IONOS_API_KEY=dein_ionos_api_key
        IONOS_API_SECRET=dein_ionos_api_secret
    
    Passe die Werte entsprechend deiner Umgebung an.

    Datenbankeinrichtung (mit Prisma):

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```
    
2. **Seeding für erste benutzer und Domains:**

        npm run create-initial-users
        npm run read-domains


    Damit existieren zwei erste Benutzer:
    
    Username: ```Admin```Passwort: ```1234```  <br>
    Username: ```User``` Passwort: ```1234``` 

    Anwendung starten:
    ```bash
    npm start
    ```


        Die Anwendung ist nun unter http://localhost:3000 erreichbar.

3. **Nutzung**

    **Login:** Melde dich mit deinem Benutzerkonto an, um Zugriff auf die DNS-Verwaltung zu erhalten.
    
    **DNS-Verwaltung:** Wähle im Dashboard deine Domain aus und verwalte die DNS-Einträge über die intuitive Benutzeroberfläche.
    
    **Drittzugriff:** Verwalte Nutzerkonten und konfiguriere ihr "Erlaubte Domains" im Admin Panel, um anderen (Freunden, Familie, Kollegen) einen begrenzten Zugriff zu ermöglichen. (Nicht auf alle Domains in deinem IONOS-Konto)
    
**Contributing**

Beiträge sind herzlich willkommen! Wenn du Fehler findest, neue Features implementieren oder die Dokumentation verbessern möchtest, eröffne bitte ein Issue oder erstelle einen Pull Request.

**Lizenz**

Dieses Projekt steht unter der ISC-Lizenz.
Die ISC-Lizenz ist eine sehr kurze, permissive Lizenz, die vergleichbar mit der MIT-Lizenz ist.

**Autor**

Jonas Menter

Kontakt
Falls du Fragen oder Anregungen hast, kannst du gerne ein Issue eröffnen oder mich direkt kontaktieren.