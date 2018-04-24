'use strict'
var ServerBoardListener = require('./serverBoardListener'),
    ServerSensorRegister = require('./serverSensorRegister'),
    exec = require('child_process').exec,
    runOnce = true;

module.exports = {
    start(config) {
        // console.log(config);
        exec('make TARGET=zoul --directory contiki-ng/examples/rpl-border-router/ savetarget');
        ServerSensorRegister = new ServerSensorRegister();
        ServerBoardListener = new ServerBoardListener();
        startServers(config);
    }
}

var startServers = function (config) {
    let connectRouter = exec('make --directory contiki-ng/examples/rpl-border-router/ connect-router');
    connectRouter.stdout.on('data', (data) => {
        console.log('stdout:');
        console.log(data);
        if (runOnce) {
            setTimeout(() => {
                ServerSensorRegister.start({
                    server: config.serverSensorRegisterConfigs
                });
                ServerBoardListener.start({
                    server: config.serverBoardListenerConfigs,
                    remote: config.remoteConfigs
                });
            }, 10000);
            runOnce = false;
        }
    });

    connectRouter.stderr.on('data', (data) => {
        if (data.split('Error ')[1]) {
            console.log('A Reiniciar...');
            console.log('Code: ', data.split('Error ')[1]);
            setTimeout(() => {
                startServers(config);
            }, 10000);
        }
    });

}
