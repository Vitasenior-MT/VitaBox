'use strict'
var ServerBoardListener = require('./serverBoardListener'),
    exec = require('child_process').exec,
    ServerSensorRegister = require('./serverSensorRegister'),
    runOnce = true;

module.exports = {
    start(config) {
        console.log(config);
        exec('make TARGET=zoul --directory /home/pi/contiki-ng/examples/rpl-border-router/ savetarget');
        startServers(config);
    }
}

var startServers = function (config) {
    let connectRouter = exec('make --directory /home/pi/contiki-ng/examples/rpl-border-router/ connect-router');
    connectRouter.stdout.on('data', (data) => {
        console.log('stdout:');
        console.log(data);
        if (runOnce) {
            setTimeout(() => {
                ServerSensorRegister = new ServerSensorRegister({
                    server: config.serverSensorRegisterConfigs
                });
                ServerBoardListener = new ServerBoardListener({
                    server: config.serverBoardListenerConfigs,
                    remote: config.remoteConfigs
                });
            }, 10000);
            runOnce = false;
        }
    });

    connectRouter.stderr.on('data', (data) => {
        console.log('stderr:');
        console.log(data);
        console.log(data.split('Error ')[1]);
        if (data.split('Error ')[1]) {
            setTimeout(() => {
                console.log('hereeeeeeeeeeeeeeeeeeeeeeeee');
                startServers(config);
            }, 10000);
        }
    });

}
