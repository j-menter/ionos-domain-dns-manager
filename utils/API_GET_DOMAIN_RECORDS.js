const axios = require("axios");

const API_KEY = `${process.env.IONOS_API_PREFIX}.${process.env.IONOS_API_SECRET}`;
const API_ZONE_URL = `${process.env.DNS_BASE_URL}/zones`;

async function API_GET_DOMAIN_RECORDS(domainId) {
  try {
    const response = await axios.get(`${API_ZONE_URL}/${domainId}`, {
      headers: {
        "accept": "application/json",
        "X-API-Key": API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Domain-Records:", error);
    throw error;
  }
}

module.exports = { API_GET_DOMAIN_RECORDS };
