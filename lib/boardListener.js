'use strict'
var ServerBoardListener = require('./serverBoardListener'),
    ServerSensorRegister = require('./serverSensorRegister'),
    exec = require('child_process').exec,
    runOnce = true;

module.exports = {
    start(config) {
        console.log(config);
        exec('make TARGET=zoul --directory contiki-ng/examples/rpl-border-router/ savetarget');
        ServerSensorRegister = new ServerSensorRegister();
        ServerBoardListener = new ServerBoardListener();
        startServers(config);
    }
}

var startServers = function (config) {
    let connectRouter = exec('make --directory contiki-ng/examples/rpl-border-router/ connect-router');
    isRunning('connect-router').then((v) => console.log(v));
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

function isRunning(linux) {
    return new Promise(function (resolve, reject) {
        const plat = process.platform
        const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
        const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
        if (cmd === '' || proc === '') {
            resolve(false)
        }
        exec(cmd, function (err, stdout, stderr) {
            resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
        })
    })
}
