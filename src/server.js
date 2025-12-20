/**
 * @module server
 * @description Express app entry point with middleware setup and route registration
 * @requires express
 * @requires ./middlewares/requests
 * @requires ./routes/stack
 * @requires ./routes/independent
 * @requires ./routes/general
 */

const express = require('express');
const logReq = require('./middlewares/requests');

const PORT = 8496;
const app = express();

// Middleware setup
app.use(express.json());
app.use(logReq);

// Route registration
const stackRoutes = require('./routes/stack');
app.use('/calculator', stackRoutes);

const independentRoutes = require('./routes/independent');
app.use('/calculator', independentRoutes);

const generalRoutes = require('./routes/general');
app.use(generalRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
