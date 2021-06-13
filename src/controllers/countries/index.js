const CountriesModel = require('../../models/country');
const middlewares = require('../../middlewares/_common');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
    CountriesRes: {
        Countries: async (root, { name }, context, info) => {
            try {
                try {
                    //authorize user...
                    middlewares.validateUser(context?.user);
                } catch (error) {
                    throw new AuthenticationError(error);
                }
                // fetch the full list of the countries...
                const countries = await CountriesModel.fetchByName(name);
                // return the output...
                return countries;
            } catch (error) {
                throw error;
            }
        }
    }
}