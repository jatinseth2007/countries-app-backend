const tracer = require('tracer').colorConsole();
const { gql } = require('apollo-server-express');
const CurrencyModel = require('../../models/currency');

module.exports = {
    CurrencyDef: gql`
        type Currency {
            code: String!,
            name: String!,
            symbol: String!,
            exchangeRate: Float
        }
    `,
    CurrencyRes: {
        calculateExchageRate: async ({ code }, args, context, info) => {
            try {
                console.log(`a duck died.`);
                const exchangeRate = await CurrencyModel.fetchCurrencyExchangeRateByBase(code);
                return parseFloat(exchangeRate);
            } catch (error) {
                tracer.error(error);
                return null;
            }
        }
    }
}