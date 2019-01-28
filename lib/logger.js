/**
 * Configurations of logger.
 */
const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const consoleConfig = [
    new winston.transports.Console({
        'colorize': true
    })
];

const createLogger = new winston.Logger({
    'transports': consoleConfig
});

const successLogger = createLogger;
successLogger.add(winstonRotator, {
    'name': 'access-file',
    'level': 'info',
    'filename': './logs/access.%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    //    'maxSize': '20m',
    'prepend': true
});

const errorLogger = createLogger;
errorLogger.add(winstonRotator, {
    'name': 'error-file',
    'level': 'error',
    'filename': './logs/error.%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    //    'maxSize': '20m',
    'prepend': true
});

const customInfoLogger = filename => {
    return createLogger.add(winstonRotator, {
        'name': 'custom-file',
        'level': 'debug',
        'filename': './logs/' + filename + '.%DATE%.log',
        'json': false,
        'datePattern': 'YYYY-MM-DD',
        //    'maxSize': '20m',
        'prepend': true
    });
}

module.exports = {
    'customInfoLog': customInfoLogger,
    'successlog': successLogger,
    'errorlog': errorLogger
};