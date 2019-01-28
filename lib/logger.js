/**
 * Configurations of logger.
 */
var winston = require('winston'),
    winstonRotator = require('winston-daily-rotate-file'),
    consoleConfig = [
        new winston.transports.Console({
            'colorize': true
        })
    ],
    successLogger = new winston.createLogger({
        'transports': consoleConfig
    }),
    errorLogger = new winston.createLogger({
        'transports': consoleConfig
    });

successLogger.add(winstonRotator, {
    'name': 'access-file',
    'level': 'info',
    'filename': './logs/access.%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    //    'maxSize': '20m',
    'prepend': true
});

errorLogger.add(winstonRotator, {
    'name': 'error-file',
    'level': 'error',
    'filename': './logs/error.%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    //    'maxSize': '20m',
    'prepend': true
});

var customInfoLogger = filename => {
    return new winston.createLogger({
        'transports': consoleConfig
    }).add(winstonRotator, {
        'name': 'debug-file',
        'level': 'debug',
        'filename': './logs/' + filename + '.%DATE%.log',
        'json': false,
        'datePattern': 'YYYY-MM-DD',
        //    'maxSize': '20m',
        'prepend': true
    });
}

module.exports = {
    customInfoLog: customInfoLogger,
    successlog: successLogger,
    errorlog: errorLogger
};