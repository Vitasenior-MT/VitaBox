/**
 * Configurations of logger.
 */
const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');
var customConfig = {
    'name': 'custom-file',
    'level': 'info',
    'filename': './logs/custom.%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    //    'maxSize': '20m',
    'prepend': true
}

const customConfigLogger = function (filename) {
    customConfig = {
        'name': 'custom-file',
        'level': 'info',
        'filename': './logs/' + (filename ? filename : 'custom') + '.%DATE%.log',
        'json': false,
        'datePattern': 'YYYY-MM-DD',
        //    'maxSize': '20m',
        'prepend': true
    }
    console.log()
}

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

const customInfoLogger = createLogger;
customInfoLogger.add(winstonRotator, customConfig);

module.exports = {
    'customInfoLog': customInfoLogger,
    'configLogger': customConfigLogger,
    'successlog': successLogger,
    'errorlog': errorLogger
};