const axios = require('axios');
const API_KEY = `${process.env.IONOS_API_PREFIX}.${process.env.IONOS_API_SECRET}`;
const API_ZONE_URL = `${process.env.DNS_BASE_URL}/zones`;

async function API_POST_DELETE_DNS_RECORD(zoneId, recordId) {
    try {
        const response = await axios.delete(
            `${API_ZONE_URL}/${zoneId}/records/${recordId}`,
            {
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': API_KEY
                }
            }
        );
        console.log('\x1b[31m%s\x1b[0m', `DNS Record ${recordId} aus Zone ${zoneId} wurde erfolgreich gelöscht.`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Löschen des DNS-Records:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { API_POST_DELETE_DNS_RECORD };
