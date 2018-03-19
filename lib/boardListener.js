'use strict'
var ServerBoardListener = require('./serverBoardListener'),
    ServerSensorRegister = require('./serverSensorRegister');

module.exports = {
    start(config) {
        console.log(config);
        ServerSensorRegister = new ServerSensorRegister({
            server: config.serverSensorRegisterConfigs,
            remote: config.remoteConfigs
        });

        ServerBoardListener = new ServerBoardListener({
            server: config.serverBoardListenerConfigs,
            remote: config.remoteConfigs
        });
    }
}
