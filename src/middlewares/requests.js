/**
 * @module request
 * @description Logs incoming requests and their durations (INFO + DEBUG)
 * @requires loggers
 */

const { requestLogger, stackLogger, independentLogger } = require('../loggers');

let reqCount = 1;

/**
 * @function logReq
 * @description Express middleware that logs each request start and duration
 */
function logReq(req, res, next) {
    const reqId = reqCount++;
    req.id = reqId;
    const start = Date.now();

    // Set context for the logger so the layout picks up the requestId
    requestLogger.addContext('requestId', reqId);
    stackLogger.addContext('requestId', reqId);
    independentLogger.addContext('requestId', reqId);

    // Log INFO before request is handled
    requestLogger.info(
        `Incoming request | #${reqId} | resource: ${req.path} | HTTP Verb ${req.method.toUpperCase()}`
    );

    // Log DEBUG when request ends
    res.on('finish', () => {
        const duration = Date.now() - start;
        requestLogger.debug(`request #${reqId} duration: ${duration}ms`);
    });

    next();
}

module.exports = logReq;