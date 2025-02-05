const axios = require('axios');
const API_KEY = `${process.env.IONOS_API_PREFIX}.${process.env.IONOS_API_SECRET}`;
const API_ZONE_URL = `${process.env.DNS_BASE_URL}/zones`;

async function API_POST_DNS_RECORDS(domainId, domainName, type, content, ttl, prio, disabled) {
  try {
    // Request Body (Payload) als Array mit einem Objekt
    const payload = [
      {
        name: domainName,
        type: type,
        content: content,
        ttl: ttl,
        prio: prio,
        disabled: disabled
      }
    ];

    // Axios-Aufruf dert post route
    const response = await axios.post(
      `${API_ZONE_URL}/${domainId}/records`,
      payload,
      {
        headers: {
          Accept: 'application/json',
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Die Subdomain', response.data[0].name, 'erfolgreich erstellt:');
    return response.data;
  } catch (error) {
    console.error(
      'Fehler beim Erstellen des DNS-Records:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { API_POST_DNS_RECORDS };
