'use strict'
var cp = require('child_process'),
    log = require('./logger'),
    utils = require('./utils.js'),
    errorLog = log.errorlog,
    successlog = log.successlog,
    connectServerlib = require('./connectServerlib.js'),
    mode = process.env.NODE_ENV || "DEV",
    ioClient = require('socket.io-client');


var self = module.exports = {
    /**
     * TODO: Loads all the settings for the manager
     * @param {}
     */
    loadSettings: function (sktcon, manager) {
        successlog.info(`Loading Settings`);
        var config = require('./../config-' + mode.toLowerCase() + '/config.js');
        var socket = ioClient.connect(config.websockets.host, { reconnect: true, query: { token: process.env.token } });
        console.log(config);
        console.log(process.env.token);
        // Add a connect listener
        socket.on('connect', function (socket) {
            successlog.info(`Connected! To Cloud Websocket`);
        });

        socket.on('message', function (data) {
            console.log('message: ', data);
            switch (data.content) {
                case 'update':
                    manager.updateAll();
                    break;
                case 'warning_bio':
                    connectServerlib.getWarnings((result) => {
                        console.log('result: ', result);
                    });
                    break;
                case 'schedule':
                    sktcon.sendNotification('schedule', data.msg);
                    console.log('message: ', data.msg);
                    break;
                case 'notification':
                    // {"from": <nome do emissor>, "to": <nome do paciente, pode ser null>, "message": <mensagem>}
                    sktcon.sendNotification('notification', data.msg);
                    console.log('message: ', data.msg);
                    break;
            }
        });

        socket.on('error', (err) => {
            errorLog.error(`Error -> ${err}`);
        });
    }
}