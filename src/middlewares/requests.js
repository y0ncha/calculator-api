/**
 * @module middlewares/requests
 * @description Request logging middleware for Express
 * @requires ../loggers
 */

const { requestLogger, stackLogger, independentLogger } = require('../loggers');

let reqCount = 1;

/**
 * @function logReq
 * @description Express middleware that logs request start and duration
 */
function logReq(req, res, next) {
    const reqId = reqCount++;
    req.id = reqId;
    const start = Date.now();

    // Set context for loggers
    requestLogger.addContext('requestId', reqId);
    stackLogger.addContext('requestId', reqId);
    independentLogger.addContext('requestId', reqId);

    // Log incoming request
    requestLogger.info(
        `Incoming request | #${reqId} | resource: ${req.path} | HTTP Verb ${req.method.toUpperCase()}`
    );

    // Log request duration when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        requestLogger.debug(`request #${reqId} duration: ${duration}ms`);
    });

    next();
}

module.exports = logReq;