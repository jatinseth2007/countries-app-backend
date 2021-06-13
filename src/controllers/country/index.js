const { gql } = require('apollo-server-express');

module.exports = {
    CountryDef: gql`
        type Country {
            name: String!,
            population: Int!,
            currencies: [Currency] 
        }
    `
}