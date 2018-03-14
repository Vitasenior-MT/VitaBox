'use strict'
var ServerBoardListener = require('./serverBoardListener'),
    ServerSensorRegister = require('./serverSensorRegister');

module.exports = {
    start(config) {
        console.log(config);
        ServerBoardListener = new ServerBoardListener({
            server: config.serverBoardListenerConfigs,
            remote: config.remoteConfigs
        });

        //Em Construção
        /*ServerSensorRegister = new ServerSensorRegister({
            server: config.serverSensorRegisterConfigs,
            remote: config.remoteConfigs
        });*/
    }
}
