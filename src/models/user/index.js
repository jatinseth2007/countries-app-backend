const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
    /**
     * Function to add new user into system
     * Jatin Seth
     */
    async createNew({ name, email, password }) {
        try {
            const newUser = {
                name,
                email
            };

            const hashedPassword = await this.hashPassword(password);

            //add new user into global array...
            global.allUsers.push({
                ...newUser,
                password: hashedPassword
            });

            return newUser;
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Function to login the user
     * Jatin Seth
     */
    async login({ password, email }) {
        try {
            //search the user by email...
            const user = this.searchUserByEmail(email);
            // if user not found then error
            if ('email' in user === false) throw 'not authenticated';
            //compare password...
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (isPasswordMatched === false) throw 'not authenticated';
            // password matched 
            return user;
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Function to hash new password
     * Jatin Seth
     */
    async hashPassword(password) {
        try {
            const hashPassword = await bcrypt.hash(password, parseInt(process.env.APP_PASS_SALT));
            return hashPassword;
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Function to search user by email
     * Jatin Seth
     */
    searchUserByEmail(email) {
        try {
            let user = {};
            //check if we have users...
            if (global.allUsers.length > 0) {
                for (const item of global.allUsers) {
                    if (email.toUpperCase() === item.email.toUpperCase()) {
                        user = {
                            ...item
                        };
                        break;
                    }//EOI
                }//EOL
            }//EOI

            return user;
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Genrate the JWT token
     * Jatin Seth
     */
    generateJwtToken(payload) {
        try {
            return jwt.sign(payload, process.env.APP_JWT_SECRET, { algorithm: 'HS256', expiresIn: '15m' });
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Genrate the JWT refresh token
     * Jatin Seth
     */
    generateJwtRefreshToken(payload) {
        try {
            return jwt.sign(payload, process.env.APP_JWT_REFRESH_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Function to verify the refresh token
     * Jatin Seth
     */
    verifyRefreshToken({ refreshToken }) {
        try {
            return jwt.verify(refreshToken, process.env.APP_JWT_REFRESH_SECRET);
        } catch (error) {
            throw error;
        }
    }//EOF

    /**
     * Function to verify the refresh token
     * Jatin Seth
     */
    verifyToken({ token }) {
        try {
            return jwt.verify(token, process.env.APP_JWT_SECRET);
        } catch (error) {
            throw error;
        }
    }
}


module.exports = new User();