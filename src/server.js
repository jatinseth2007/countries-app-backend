const UserModel = require('./models/user');
const { CountryDef } = require('./controllers/country');
const { ApolloServer } = require('apollo-server-express');
const { CountriesRes } = require('./controllers/countries');
const { CurrencyDef, CurrencyRes } = require('./controllers/currency');
const { UserDef, LoginResponseDef, SignUpResponseDef, UserRes } = require('./controllers/user');

class Server {
    constructor() {
        //defs
        this.Query = `
            type Query {
                Countries(name: String!): [Country]
            }
        
            type Mutation {
                Login(email: String!, password: String!): LoginResponse!,
                Signup(name: String!, email: String!, password: String!): SignUpResponse!,
                RefreshToken(refreshToken: String!): LoginResponse!
            }
        `;
        // Provide resolver functions for your schema fields
        this.resolvers = {
            Query: {
                Countries: CountriesRes.Countries
            },
            Currency: {
                exchangeRate: CurrencyRes.calculateExchageRate
            },
            Mutation: {
                Login: UserRes.Login,
                Signup: UserRes.Signup,
                RefreshToken: UserRes.RefreshToken
            }
        };
    }

    /**
     * Function to initiate the server
     * Jatin Seth
     */
    startServer() {
        try {
            const server = new ApolloServer({
                typeDefs: [this.Query, CountryDef, CurrencyDef, UserDef, LoginResponseDef, SignUpResponseDef],
                resolvers: this.resolvers,
                context: ({ req }) => {
                    try {
                        let user = {};
                        const { authorization } = req.headers;
                        if (authorization) {
                            try {
                                user = UserModel.verifyToken({
                                    token: authorization
                                });
                            } catch (error) {
                                user = {};
                            }
                        }//EOI

                        return { user };
                    } catch (error) {
                        throw error;
                    }
                },
                debug: (process.env.APP_ENVIRONMENT === 'production') ? false : true
            });
            return server;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Server();