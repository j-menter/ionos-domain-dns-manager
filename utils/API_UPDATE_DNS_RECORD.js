const axios = require('axios');
const API_KEY = `${process.env.IONOS_API_PREFIX}.${process.env.IONOS_API_SECRET}`;
const API_ZONE_URL = `${process.env.DNS_BASE_URL}/zones`;

async function API_UPDATE_DNS_RECORD(zoneId, recordId, destination, ttl, prio, disabled, hostname) {
  try {
    const response = await axios.put(
      `${API_ZONE_URL}/${zoneId}/records/${recordId}`,
      {
        name: hostname,
        disabled,              // Boolean
        content: destination,  // z. B. "1.1.1.1"
        ttl: Number(ttl),      // TTL als Zahl, z. B. 3600
        prio: Number(prio)     // Priorität als Zahl
      },
      {
        headers: {
          'accept': 'application/json',
          'X-API-Key': API_KEY
        }
      }
    );
    console.log(`DNS Record ${recordId} aus Zone ${zoneId} wurde erfolgreich aktualisiert.`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des DNS-Records:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { API_UPDATE_DNS_RECORD };
