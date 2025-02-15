// passportConfig.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

passport.use(new LocalStrategy(
  {
    usernameField: "login", // Dieses Feld enthält entweder E-Mail oder Benutzername
    passwordField: "password"
  },
  async (login, password, done) => {
    try {
      // Suche nach einem User, der entweder die eingegebene Email oder den Benutzernamen hat
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: login },
            { benutzername: login }
          ]
        }
      });
      
      if (!user) {
        return done(null, false, { message: "Benutzer nicht gefunden." });
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return done(null, false, { message: "Falsches Passwort." });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Für das Session-Management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
