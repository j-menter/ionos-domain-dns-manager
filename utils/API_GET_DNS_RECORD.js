const axios = require('axios');

const API_KEY = `${process.env.IONOS_API_PREFIX}.${process.env.IONOS_API_SECRET}`;
const API_ZONE_URL = `${process.env.DNS_BASE_URL}/zones`;

async function API_GET_DNS_RECORD(zoneId, recordId) {
  try {
    const url = `${API_ZONE_URL}/${zoneId}/records/${recordId}`;
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(
      `Fehler beim Abrufen des Records (Zone: ${zoneId}, Record: ${recordId}):`,
      error
    );
    throw error;
  }
}

module.exports = { API_GET_DNS_RECORD };
