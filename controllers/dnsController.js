const { API_POST_DNS_RECORDS } = require("../utils/API_POST_DNS_RECORDS");

exports.getcreateDnsA = (req, res) => {
  
    res.render("createDns/A", { domain: req.params.domain });
  };