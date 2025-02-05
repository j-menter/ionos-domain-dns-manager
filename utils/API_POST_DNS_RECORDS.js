const axios = require('axios');
const API_KEY = `${process.env.IONOS_API_PREFIX}.${process.env.IONOS_API_SECRET}`;
const API_ZONE_URL = `${process.env.DNS_BASE_URL}/zones`;

async function createDnsRecords(domainId, domainName, type, content, ttl) {
    try {
        const response = await axios.post(`${API_ZONE_URL}/${domainId}/records`, 
            {
                name: subdomainname,
                type: subdomaintype,
                content: subdomainip,
                ttl: subdomainttl,
                prio: 0,
                disabled: false
            }, 
            {
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Die Subdomain', response.name, 'erfolgreich erstellt:');
        return response.data;
    } catch (error) {
        console.error('Fehler beim Erstellen der Subdomain:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { createDnsRecords };
