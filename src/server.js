/**
 * @module server
 * @description Express server setup for calculator application
 */


/****** IMPORTS ******/
const express = require('express');
const logReq = require('./middlewares/requests'); // Middleware to log requests


/****** CONFIG ******/
const PORT = 8496;
const app = express();

/****** MIDDLEWARE ******/
app.use(express.json());
app.use(logReq); // Middleware to log requests

/****** ROUTS ******/
/**
 * @constant {Router | {}} stackRoutes - Routes for stack-based calculator operations
 * @description This module handles operations that involve a stack-based approach to calculations.
 * @type {Router | {}}
 * @requires ./routes/stack
 * @see ./routes/stack
 */
const stackRoutes = require('./routes/stack');
app.use('/calculator', stackRoutes);

/**
 * @constant {Router | {}} independentRoutes - Routes for independent.log calculator operations
 * @description This module handles operations that do not depend on a stack, such as basic arithmetic.
 * @type {Router | {}}
 * @requires ./routes/independent
 * @see ./routes/independent
 */
const independentRoutes = require('./routes/independent');
app.use('/calculator', independentRoutes);

/**
 * @constant {Router | {}} generalRoutes - General routes for calculator operations
 * @description This module handles general operations such as health checks and history management.
 * @type {Router | {}}
 * @requires ./routes/general
 * @see ./routes/general
 */
const generalRoutes = require('./routes/general');
app.use(generalRoutes);


/****** INIT SERVER ******/
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
