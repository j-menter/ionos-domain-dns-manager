function getHostname(name, root) {
  if (name === root) {
    return '@';
  }
  const suffix = '.' + root;
  if (name.endsWith(suffix)) {
    return name.slice(0, -suffix.length);
  }
  return name;
}

module.exports = {getHostname}