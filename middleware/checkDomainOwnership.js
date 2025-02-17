// middleware/checkDomainOwnership.js
module.exports = function checkDomainOwnership(req, res, next) {
  if (!req.params.domain) {
    return res.status(400).send("Domain-Parameter fehlt.");
  }

  const requestedDomain = req.params.domain.trim().toLowerCase();
  console.log("Requested domain:", requestedDomain);

  if (!req.user || !Array.isArray(req.user.domains)) {
    return res.status(403).send("Kein Benutzer oder Domains vorhanden.");
  }

  const userDomains = req.user.domains.map(d => 
    (typeof d.name === 'string' ? d.name.trim().toLowerCase() : "")
  );
  console.log("User domains:", userDomains);

  if (userDomains.some(domain => domain === requestedDomain)) {
    return next();
  }

  return res.status(403).render('domainError', { domain: requestedDomain });
};
