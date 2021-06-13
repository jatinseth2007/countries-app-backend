const UserModel = require('../../models/user');
const { gql } = require('apollo-server-express');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

module.exports = {
    UserDef: gql`
        type User {
            name: String!
            email: String!,
            password: String
        }
    `,
    LoginResponseDef: gql`
        type LoginResponse {
            success: Boolean!,
            token: String!,
            refreshToken: String,
            message: String!,
            user: User!
        }
    `,
    SignUpResponseDef: gql`
        type SignUpResponse {
            success: Boolean!,
            message: String!,
            user: User!
        }
    `,
    UserRes: {
        Login: async (root, args, context, info) => {
            try {
                const user = await UserModel.login(args);
                if ('password' in user) delete user.password;
                // user authenticated, let's create JWT token for user
                return {
                    success: true,
                    token: UserModel.generateJwtToken(user),
                    refreshToken: UserModel.generateJwtRefreshToken(user),
                    message: `User logged in successfully`,
                    user: {
                        ...user
                    }
                };
            } catch (error) {
                throw new AuthenticationError(error);
            }
        },
        Signup: async (root, args, context, info) => {
            try {
                //find if user already exist...
                const user = UserModel.searchUserByEmail(args.email);
                if ("email" in user)
                    throw "user already exist";
                const newUser = await UserModel.createNew(args);
                return {
                    success: true,
                    message: `Account has been created successfully.`,
                    user: newUser
                };
            } catch (error) {
                throw new UserInputError(error);
            }
        },
        RefreshToken: async (root, args, context, info) => {
            try {
                // first verify refresh token...
                const user = UserModel.verifyRefreshToken(args);
                const payload = {
                    email: user.email,
                    name: user.name
                };
                //check if user found
                if ('email' in user === false) throw 'not authenticated';
                // generate new tokens...
                return {
                    success: true,
                    token: UserModel.generateJwtToken(payload),
                    message: `New token generated sucessfully`,
                    user: payload
                };
            } catch (error) {
                throw new AuthenticationError(error);
            }
        }

    }
}