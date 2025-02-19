// Middleware, um sicherzustellen, dass der User eingeloggt ist
module.exports = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};
