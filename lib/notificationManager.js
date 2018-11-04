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
    loadSettings: function () {
        var config = require('./../config-' + mode.toLowerCase() + '/config.js');
        var socket = ioClient.connect(config.websockets.host, { reconnect: true, query:  { token: process.env.token }});
        console.log(config);
        console.log(process.env.token);
        // Add a connect listener
        socket.on('connect', function (socket) {
            console.log('Connected! To Cloud Websocket');
        });

        socket.on('message', function (data) {
            console.log('message: ', data);
            switch (data.content) {
                case 'update':
                    break;
                case 'warning_bio':
                    //end point: GET - /warning
                    connectServerlib.getWarnings();
                    break;
                case 'notification':
                    console.log('message: ', data.msg);
                    break;
            }
        });
    }
}