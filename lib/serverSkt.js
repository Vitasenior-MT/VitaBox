'use strict'
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow
var sckOn = null;
var NodeCEC = require('./nodecec.js'),
    c = require('./cecModels.js'),
    CEC = c.CEC,
    CECMonitor = c.CECMonitor,
    readline = require('readline'),
    stdin = process.openStdin(),
    ///////////////////////////////////////////////////////////////////////////////
    // cli commands - see man cec-client
    ///////////////////////////////////////////////////////////////////////////////
    commands = [ // cli.js commands
        'active', // Output state on current active source
        'quit', // Quit cli.js
        'physical', // Give physical address of given logical address
        'logical', // Give primary logical address of given physical address
        'address', // Give state of cli.js logical and physical address
        'addresses', // Output current state information for all logical addresses
        'osdname', // Output state of name for logical or physical address
        'power', // Output state of power for logical or physical address
        'state', // Get current state cache
        'cp', // Get current power state
        'hdmi', // Set HDMI port
        // cec-client commands
        'ad', 'as', 'at', 'bl', 'is', 'la', 'lad', 'lang', 'log', 'mon', 'mute', 'name', 'on',
        'osd', 'p', 'pa', 'ping', 'poll', 'pow', 'scan', 'self', 'sp', 'spl', 'standby', 'tx',
        'txn', 'ven', 'ver', 'voldown', 'volup'
    ],
    ///////////////////////////////////////////////////////////////////////////////
    // cli.js local functions
    ///////////////////////////////////////////////////////////////////////////////
    functions = {
        addresses: function () {
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].forEach(function (t) {
                var output = [
                    lpad(t, 2, '0'),
                    rpad(monitor.GetOSDName(t), 20),
                    rpad(monitor.Logical2Physical(t), 7),
                    rpad('power: ' + monitor.GetPowerStatusName(t), 35)
                ]
                console.log('[' + output.join(']  [') + ']');
            })
        },
        address: function () {
            console.log('My address:');
            console.log(lpad('logical addresses: ', 19) + monitor.GetLogicalAddresses().join(', '));
            console.log(lpad('primary logical: ', 19) + monitor.GetLogicalAddress());
            console.log(lpad('physical: ', 19) + monitor.GetPhysicalAddress());
            sendOutPutMsg('msgOutput', 'My address:');
            sendOutPutMsg('msgOutput', lpad('logical addresses: ', 19) + monitor.GetLogicalAddresses().join(', '));
            sendOutPutMsg('msgOutput', lpad('primary logical: ', 19) + monitor.GetLogicalAddress());
            sendOutPutMsg('msgOutput', lpad('physical: ', 19) + monitor.GetPhysicalAddress());
        },
        active: function () {
            console.log('active source: ' + monitor.GetActiveSource());
            sendOutPutMsg('msgOutput', 'active source: ' + monitor.GetActiveSource());
        },
        logical: function (physical) {
            console.log('primary logical address: ' + monitor.Physical2Logical(physical));
            sendOutPutMsg('msgOutput', 'primary logical address: ' + monitor.Physical2Logical(physical));
        },
        physical: function (logical) {
            console.log('physical address: ' + monitor.Logical2Physical(logical));
            sendOutPutMsg('msgOutput', 'physical address: ' + monitor.Logical2Physical(logical));
        },
        power: function (address) {
            console.log('power status: ' + monitor.GetPowerStatusName(address) + ' (' + monitor.GetPowerStatus(address) + ')');
            sendOutPutMsg('msgOutput', 'power status: ' + monitor.GetPowerStatusName(address) + ' (' + monitor.GetPowerStatus(address) + ')');
        },
        osdname: function (address) {
            console.log('OSD name: ' + monitor.GetOSDName(address));
            sendOutPutMsg('msgOutput', 'OSD name: ' + monitor.GetOSDName(address));
        },
        state: function () {
            console.log(monitor.GetState());
        },
        cp: function (address) {
            monitor.SendCommand(null, address, CEC.Opcode.GIVE_DEVICE_POWER_STATUS, CECMonitor.EVENTS.REPORT_POWER_STATUS)
                .then(function (packet) {
                    console.log('POWER', packet.data.str);
                    sendOutPutMsg('msgOutput', 'POWER', packet.data.str);
                })
                .catch(function (error) {
                    console.log('POWER UNKNOWN');
                    console.log(error);
                    sendOutPutMsg('msgOutput', 'POWER UNKNOWN');
                    sendOutPutMsg('msgOutput', error);
                })
        },
        hdmi: function (port) {
            monitor.state_manager.hdmi = Number.parseInt(port, 10);
        },
        quit: function () {
            monitor.Stop();
            process.exit(0);
        }
    },
    //All config options are optionals
    monitor = new CECMonitor('vita-box', {
        debug: false, // enable/disabled debug events from cec-client
        hdmiport: 1, // set inital hdmi port
        processManaged: false, // set/unset handlers to avoid unclear process exit.
        recorder: true, //enable cec-client as recorder device
        player: true, //enable cec-client as player device
        tuner: true, //enable cec-client as tuner device
        audio: true, //enable cec-client as audio system device
        autorestart: true, //enable autorestart cec-client to avoid some wierd conditions
        command_timeout: 3, //set timeout to invalidate status cache and search current power state
        no_serial: { //controls if the monitor restart cec-client when that stop after the usb was unplugged
            reconnect: true, //enable reconnection attempts when usb is unplugged
            wait_time: 30, //in seconds - time to do the attempt
            trigger_stop: false //avoid trigger stop event
        },
        cache: {
            enable: true,
            timeout: 30,
            autorefresh: true
        }
    });

var cec = new NodeCEC();
var remotelib = require('./remotelib.js');
var exec = require('child_process').exec;

var keyEventRelease = true,
    timeCount = 0,
    timeToWait = 1000,
    waitingTime = 2,
    messageConfirmed = true,
    messageTimerCount = 0,
    messageCount = 0,
    multiMessage = [],
    remoteOldHdmiState = 0,
    modalOldHdmiState = 0;
// start cec connection
cec.start();

var ServerSktIo = function (options) {
    this.server = options.server;
};

monitor.once(CECMonitor.EVENTS._READY, function () {
    functions.address();
    setTimeout(function () {
        console.log('active source ---> ', functions.power(0));
        console.log('active source ---> ', monitor.GetPowerStatus(0));
        if (monitor.GetPowerStatus(0) === 153) {
            reconnect(2, 'vitaBox');
        }
    }, 4000);
    console.log(' -- READY -- ');
    sendOutPutMsg('msgOutput', ' -- READY -- ');
    // rl.prompt();
});

// Any Traffic containing an opcode
monitor.on(CECMonitor.EVENTS._OPCODE, displayPayload);

// If the cec-client pipe is closed
monitor.on(CECMonitor.EVENTS._STOP, function () {
    console.log('cec-client exit');
    sendOutPutMsg('msgOutput', 'cec-client exit');
    // rl.prompt();
})

// Debug messages from cec-client
monitor.on(CECMonitor.EVENTS._DEBUG, function (data) {
    // set 'debug: true' on new CECMonitor
    console.log('[DEBUG] ' + JSON.stringify(data));
    sendOutPutMsg('msgOutput', data);
    // rl.prompt();
})

stdin.on('data', function (chunk) {
    cec.send(chunk);
});

ServerSktIo.prototype.init = function () {
    var self = this;
    this.io = this.server.io;
    sckOn = this.io;

    // Fired upon a connection
    this.io.on("connection", function (socket) {
        var c = socket.request.connection._peername;
        console.log("+++++++++++++++++++++ ADD ++++++++++++++++++++++++++");
        console.log("Connected - " + c.address + " : " + c.port);
        console.log("User - " + socket.id);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");

        // deteta quando o cliente se desconecta do servidor
        socket.on('disconnect', function () {
            console.log("Client Disconnect...");
        });

        try {
            socket.emit('hdmistatus', {
                "logical addresses": monitor.GetLogicalAddresses().join(', '),
                "primary logical": monitor.GetLogicalAddress(),
                "physical": monitor.GetPhysicalAddress()//,
                // "active source":        monitor.GetActiveSource(),
                // "state":                monitor.GetState()
            });
        } catch (e) {
            console.log("Error send hdmistatus.", e.toString());
            socket.emit('hdmistatus', {
                status: 'error',
                data: e.toString()
            });
            //reconnect(2, 'vitaBox');
        }

        cec.on('ready', function (data) {
            console.log("ready...");
            socket.emit('ready', "ready");

        });

        cec.on('status', function (data) {
            console.log("[" + data.id + "] changed from " + data.from + " to " + data.to);
            socket.emit('status', data);
        });

        cec.on('key', function (data) {
            console.log(data);
            keyEvents(data.code);
        });

        cec.on('close', function (code) {
            process.exit(0);
        });

        cec.on('error', function (data) {
            console.log('---------------- ERROR ------------------');
            console.log(data);
            console.log('-----------------------------------------');
            socket.emit('error', data);
        });
    });
};

ServerSktIo.prototype.sendSensorAlert = function (data) {
    if (messageConfirmed) {
        hdmiState('modal');
    }
    vitaWarnings(data);
    messageConfirmed = false;
};

module.exports = ServerSktIo;

function sendOutPutMsg(tag, msg) {
    console.log("Send socket Alert", tag, msg);
    if (sckOn) {
        sckOn.sockets.emit(tag, msg);
    }
}

function displayPayload(packet) {
    console.log(JSON.stringify(packet));
    sendOutPutMsg('msgOutput', packet);
    // rl.prompt();
}

function rpad(str, size, pad) {
    var s = padding(size, str, pad)
    return str + s
}

function padding(size, str, pad) {
    if (pad === undefined)
        pad = ' '
    if (str === null)
        str = 'null'
    else if (str === undefined)
        str = 'undefined'
    var s = new Array(size - str.toString().length).fill(pad).join('')
    return s
}

function lpad(str, size, pad) {
    var s = padding(size, str, pad)
    return s + str
}

function keyEvents(code) {
    remotelib.getKey(code, function (err, result) {
        if (code === result.code) {
            if (result.timed_flg) {
                if (keyEventRelease) {
                    keyEventProcessing(result.task);
                    keyEventRelease = false;
                    timer(waitingTime);
                }
            } else {
                keyEventProcessing(result.task);
            }
        }
    });
}

function keyEventProcessing(cmd) {
    if (!messageConfirmed) {
        if (cmd === 'ok_btn') {
            messageConfirmed = true;
            multiMessage = [];
            writeMessage('tx 4F:82:' + modalOldHdmiState + '0:00');
        }
    } else {
        console.log('cmd----> ', cmd);
        switch (cmd) {
            case "ch_1":
                hdmiState('remote');
                writeMessage('tx 4F:82:10:00');
                break;
            case "ch_2":
                hdmiState('remote');
                writeMessage('tx 4F:82:20:00');
                break;
            case "hdmirequest":
                hdmiState();
                break;
            case "var_state":
                writeMessage('tx 4F:82:00:00');
                console.log('remote: ', remoteOldHdmiState);
                console.log('modal: ', modalOldHdmiState);
                break;
            case "left":
                sckOn.sockets.emit('changeMenu', -1);
                break;
            case "right":
                sckOn.sockets.emit('changeMenu', 1);
                break;
            case "ok_btn":
                writeMessage('tx 4F:82:' + remoteOldHdmiState + '0:00');
                break;
            default:
                break;
        }
    }
}

function timer(waitTime) {
    var intervalObject = setInterval(function () {
        timeCount++;
        console.log(timeCount, 'seconds passed');
        if (timeCount == waitTime) {
            console.log('exiting');
            timeCount = 0;
            keyEventRelease = true;
            clearInterval(intervalObject);
        }
    }, timeToWait);
}

function writeMessage(cmd) {
    monitor.WriteRawMessage(cmd);
}

function vitaWarnings(data) {
    if (sckOn) {
        monitor.WriteRawMessage('as');
        sckOn.sockets.emit('vitaWarning', data);
    }
}

function reconnect(hdmi, osdName) {
    exec('cec-client -p ' + hdmi + ' -o ' + osdName, (error, stdout, stderr) => { });
}

function hdmiCurrentState(state, type) {
    var hdmi = state.PhysAddress;
    switch (type) {
        case 'remote':
            remoteOldHdmiState = hdmi;
            break;
        case 'modal':
            modalOldHdmiState = hdmi;
            break;
        default:
            break;
    }

    console.log("state: ", hdmi);
    console.log("remoteOldHdmiState: ", remoteOldHdmiState);
    console.log("modalOldHdmiState: ", modalOldHdmiState);
}

function hdmiState(type) {
    if (type) {
        try {
            var physAddress = (monitor.GetActiveSource() === null) ? 0 : monitor.GetActiveSource();
            var address = physAddress.split('.');
            hdmiCurrentState({ 'PhysAddress': physAddress[0] }, type);
        } catch (e) {
            hdmiCurrentState({ 'PhysAddress': 0 }, type);
        }
    }
}