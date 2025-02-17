function getHostname(sub, domain) {
  if (sub === domain) {
    return '@';
  }
  const suffix = '.' + domain;
  if (sub.endsWith(suffix)) {
    return sub.slice(0, -suffix.length);
  }
  return sub;
}

module.exports = {getHostname}

/* 
  getHostname("xyz.test.de", "test.de") // gibt "xyz" zurück
  getHostname("irgendwas", "test.de") // gibt "irgendwas" zurück 
*/