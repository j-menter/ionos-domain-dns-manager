const { API_POST_DNS_RECORDS } = require("../utils/API_POST_DNS_RECORDS");

exports.getCreateDnsA = (req, res) => {
  
  res.render("createDns/A", { domain: req.params.domain });
  
};

exports.getCreateDnsAAAA = (req, res) => {
  
  res.render("createDns/AAAA", { domain: req.params.domain });

};

exports.postCreateDnsAAAA = (req, res) => {
  
  res.render("createDns/AAAA", { domain: req.params.domain });

};