const { countriesBaseUrl } = require('../../../config');
const { get } = require('axios');

class Country {
    /**
     * Function to fetch country list by name
     * Jatin Seth
     */
    async fetchByName(name) {
        try {
            //prepare the endpoint
            const endpoint = `${countriesBaseUrl}/name/${name}`;
            //send the get request...
            const countries = await get(endpoint);
            // retur the prepared structure...
            return this.prepareOutputStructure(countries.data);
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Function to prepare the return structure
     * Jatin Seth
     */
    prepareOutputStructure(countries = []) {
        try {
            let output = [];
            //see if we have countries...
            if (countries.length > 0) {
                for (const country of countries) {
                    const { name, population, currencies } = country;
                    output.push({
                        name,
                        population,
                        currencies
                    });
                }//EOL
            }//EOI
            return output;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new Country();