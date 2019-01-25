/**
 * Configurations of logger.
 */
const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');
var customConfig = {}

const customConfigLogger = function (filename) {
    customConfig = {
        'name': 'access-file',
        'level': 'info',
        'filename': './logs/' + (filename ? filename : 'access') + '.%DATE%.log',
        'json': false,
        'datePattern': 'YYYY-MM-DD',
        //    'maxSize': '20m',
        'prepend': true
    }
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
errorLogger.add(winstonRotator, customConfig);

const customInfoLogger = createLogger;
customInfoLogger.add(winstonRotator, {
    'name': 'access-file',
    'level': 'info',
    'filename': './logs/error.%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    //    'maxSize': '20m',
    'prepend': true
});

module.exports = {
    'customInfoLog': customInfoLogger,
    'configLogger': customConfigLogger,
    'successlog': successLogger,
    'errorlog': errorLogger
};