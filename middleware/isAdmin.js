// Middleware, um Admin-Rechte zu prüfen
module.exports = function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).send("Zugriff verweigert");
};
