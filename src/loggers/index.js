/**
 * @module loggers
 * @description Log4js logger configuration and exports
 * @requires log4js
 * @requires fs
 * @requires path
 */

const loggers = require('log4js');
const fs = require('fs');
const path = require('path');

// Create logs directory if needed
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Common log layout pattern
const logLayout = {
    type: 'pattern',
    pattern: '%d{dd-MM-yyyy hh:mm:ss.SSS} %p: %m | request #%X{requestId} '
};

// Configure log4js
loggers.configure({
    appenders: {
        request: {
            type: 'file',
            filename: 'logs/requests.log',
            layout: logLayout,
            flags: 'w'
        },
        stack: {
            type: 'file',
            filename: 'logs/stack.log',
            layout: logLayout,
            flags: 'w'
        },
        independent: {
            type: 'file',
            filename: 'logs/independent.log',
            layout: logLayout,
            flags: 'w'
        },
        console: {
            type: 'console',
            layout: logLayout
        }
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'info'
        },
        'request-logger': {
            appenders: ['request', 'console'],
            level: 'info'
        },
        'stack-logger': {
            appenders: ['stack'],
            level: 'info'
        },
        'independent-logger': {
            appenders: ['independent'],
            level: 'debug'
        }
    }
});

/**
 * @constant {Logger} requestLogger
 * @description Logs all incoming requests
 */
const requestLogger = loggers.getLogger('request-logger');

/**
 * @constant {Logger} stackLogger
 * @description Logs stack-based operations
 */
const stackLogger = loggers.getLogger('stack-logger');

/**
 * @constant {Logger} independentLogger
 * @description Logs independent operations
 */
const independentLogger = loggers.getLogger('independent-logger');

module.exports = {
    requestLogger,
    stackLogger,
    independentLogger,
}