const helmet = require('helmet');
const express = require('express');
const tracer = require('tracer').colorConsole();
const middlewares = require('./middlewares/_common');
const serverHandler = require('./server');


global.allUsers = [];
global.requestLimiter = {};

//app
const app = express();
// adding helmet to app...
//app.use(helmet());
//adding enviornment vars...
require('dotenv').config(); // enviornment port

// unhandeled exception
process.on('uncaughtException', middlewares.uncaughtExceptionHandler).on('unhandledRejection', middlewares.uncaughtRejectionHandler);

// initiate the server...
const server = serverHandler.startServer();
//add express to graphql...
server.applyMiddleware({ app });

// adding middlewares...
app.use(middlewares.notFound); // not found one
app.use(middlewares.errorHandler); // error handler

//deciding port
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    tracer.log(`Running a GraphQL API server at http://localhost:${PORT}${server.graphqlPath}`);
});