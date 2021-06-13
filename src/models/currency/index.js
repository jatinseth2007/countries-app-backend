const { baseCurrency, currencyConBaseUrl } = require('../../../config');
const { get } = require('axios');

class Currency {
    /**
     * Function to fetch currency exchange rate to base currency
     * Jatin Seth
     */
    async fetchCurrencyExchangeRateByBase(currencyCode = '') {
        try {
            //prepare the query string...
            let queryString = `${currencyCode}_${baseCurrency}`;
            //fetch the data...
            const endPoint = `${currencyConBaseUrl}&q=${queryString}&apiKey=${process.env.APP_CURR_CON_API_KEY}`;
            const conversionRates = await get(endPoint);
            // extract the data...
            return conversionRates.data[queryString];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Currency();