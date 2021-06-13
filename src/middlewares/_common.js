const tracer = require('tracer').colorConsole();

class CommonMiddlewares {
    /**
     * Function to handle the not found routes
     * Jatin Seth
     */
    notFound(req, res, next) {
        try {
            const error = new Error(`Not Found - ${req.originalUrl}`);
            res.status(404);
            next(error);
        } catch (error) {
            throw error;
        }
    }// EOF

    /**
     * Funtion to handle errors
     * Jatin Seth
     */
    errorHandler(err, req, res, next) {
        try {
            const statusCode = (res.statusCode === 200) ? 500 : res.statusCode;
            res.status(statusCode);
            res.json({
                message: err.message,
                stack: process?.env?.APP_ENVIRONMENT === 'production' ? null : err.stack,
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Function to handle uncaught exceptions
     * Jaitn Seth
     */
    uncaughtExceptionHandler(error, promise) {
        tracer.error('We got uncaughtException at:', promise, 'reason:', error);
    }// EOF

    /**
     * Function to handle uncaught exceptions
     * Jaitn Seth
     */
    uncaughtRejectionHandler(error, promise) {
        tracer.error('We got unhandledRejection at:', promise, 'reason:', error);
    }// EOF

    /**
     * Function to validate user
     * Jatin Seth
     */
    validateUser(user = {}) {
        try {
            if ('email' in user === false) {
                throw "not authorized";
            }//EOI
            // validate user access tokens
            if (user.email.toUpperCase() in global.requestLimiter) {
                const { timestamp, tokens } = global.requestLimiter[user.email.toUpperCase()];
                let currDate = new Date();
                currDate.setMinutes(currDate.getMinutes() - 1);
                const minuteAgoTimestamp = currDate.getTime();
                // if first request was more than a minute ago then reset the limit...
                if (timestamp <= minuteAgoTimestamp) {
                    global.requestLimiter[user.email.toUpperCase()] = {
                        timestamp: new Date().getTime(),
                        tokens: 30
                    };
                } else if (tokens <= 0) {
                    throw 'Too many requests';
                }//EOI
            } else {
                global.requestLimiter[user.email.toUpperCase()] = {
                    timestamp: new Date().getTime(),
                    tokens: 30
                };
            }//EOI

            //reduce the token...
            global.requestLimiter[user.email.toUpperCase()].tokens -= 1;
            return true;
        } catch (error) {
            throw error;
        }
    }
}// EOC

module.exports = new CommonMiddlewares();
