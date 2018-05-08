'use strict'
var sckOn = null;
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
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
                successlog.info(`[${output.join(']  [')}]`);
            })
        },
        address: function () {
            successlog.info(`My address:`);
            successlog.info(`${lpad('logical addresses: ', 19)} ${monitor.GetLogicalAddresses().join(', ')}`);
            successlog.info(`${lpad('primary logical: ', 19)} ${monitor.GetLogicalAddress()}`);
            successlog.info(`${lpad('physical: ', 19)} ${monitor.GetPhysicalAddress()}`);
            sendOutPutMsg('msgOutput', 'My address:');
            sendOutPutMsg('msgOutput', lpad('logical addresses: ', 19) + monitor.GetLogicalAddresses().join(', '));
            sendOutPutMsg('msgOutput', lpad('primary logical: ', 19) + monitor.GetLogicalAddress());
            sendOutPutMsg('msgOutput', lpad('physical: ', 19) + monitor.GetPhysicalAddress());
        },
        active: function () {
            successlog.info(`Active source: ${monitor.GetActiveSource()}`);
            sendOutPutMsg('msgOutput', 'active source: ' + monitor.GetActiveSource());
        },
        logical: function (physical) {
            successlog.info(`Primary logical address: ${monitor.Physical2Logical(physical)}`);
            sendOutPutMsg('msgOutput', 'primary logical address: ' + monitor.Physical2Logical(physical));
        },
        physical: function (logical) {
            successlog.info(`Physical address: ${monitor.Logical2Physical(logical)}`);
            sendOutPutMsg('msgOutput', 'physical address: ' + monitor.Logical2Physical(logical));
        },
        power: function (address) {
            successlog.info(`Power status: ${monitor.GetPowerStatusName(address)} (${monitor.GetPowerStatus(address)})`);
            sendOutPutMsg('msgOutput', 'power status: ' + monitor.GetPowerStatusName(address) + ' (' + monitor.GetPowerStatus(address) + ')');
        },
        osdname: function (address) {
            successlog.info(`OSD name: ${monitor.GetOSDName(address)}`);
            sendOutPutMsg('msgOutput', 'OSD name: ' + monitor.GetOSDName(address));
        },
        state: function () {
            successlog.info(`Monitor State: ${monitor.GetState()}`);
        },
        cp: function (address) {
            monitor.SendCommand(null, address, CEC.Opcode.GIVE_DEVICE_POWER_STATUS, CECMonitor.EVENTS.REPORT_POWER_STATUS)
                .then(function (packet) {
                    successlog.info(`POWER: ${packet.data.str}`);
                    sendOutPutMsg('msgOutput', 'POWER', packet.data.str);
                })
                .catch(function (error) {
                    errorLog.error(`POWER UNKNOWN: ${error}`);
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
    }),
    cec = new NodeCEC(),
    remotelib = require('./remotelib.js'),
    sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    connectServerlib = require('./connectServerlib.js'),
    sensors = [],
    exec = require('child_process').exec,
    audioEngine = require('./audioEngine/audioEngine.js'),
    keyEventRelease = true,
    timeCount = 0,
    timeToWait = 1000,
    waitingTime = 1,
    messageConfirmed = true,
    messageTimerCount = 0,
    messageCount = 0,
    multiMessage = [],
    remoteOldHdmiState = 0,
    modalOldHdmiState = 0,
    dataToSend = [];
// start cec connection
cec.start();

/**
 * TODO: Criação do socket que será utilizado pelo servidor para comunicar com o cliente
 * @param {*} options servidor express
 */
var ServerSktIo = function (options) {
    this.server = options.server;
};

monitor.once(CECMonitor.EVENTS._READY, function () {
    functions.address();
    setTimeout(function () {
        successlog.info(`Active Source: ${functions.power(0)}`);
        successlog.info(`Active Source: ${monitor.GetPowerStatus(0)}`);
        if (monitor.GetPowerStatus(0) === 153) {
            reconnect(2, 'vitaBox');
        }
    }, 4000);
    successlog.info(` -- READY --`);
    sendOutPutMsg('msgOutput', ' -- READY -- ');
});

// Any Traffic containing an opcode
monitor.on(CECMonitor.EVENTS._OPCODE, displayPayload);

// If the cec-client pipe is closed
monitor.on(CECMonitor.EVENTS._STOP, function () {
    successlog.info(`cec-client exit`);
    sendOutPutMsg('msgOutput', 'cec-client exit');
})

// Debug messages from cec-client
monitor.on(CECMonitor.EVENTS._DEBUG, function (data) {
    sendOutPutMsg('msgOutput', data);
})

stdin.on('data', function (chunk) {
    cec.send(chunk);
});

/**
 * TODO: Inicialização do servidor
 */
ServerSktIo.prototype.init = function () {
    var self = this;
    this.io = this.server.io;

    // Fired upon a connection
    this.io.on("connection", function (socket) {
        sckOn = socket;
        sensorlib.getSensors((result) => {
            sensors = result;
        });

        postSensorData();

        var c = socket.request.connection._peername;
        successlog.info(`+++++++++++++++++++++ ADD ++++++++++++++++++++++++++`);
        successlog.info(`Connected: ${c.address}: ${c.port}`);
        successlog.info(`User - ${socket.id}`);
        successlog.info(`++++++++++++++++++++++++++++++++++++++++++++++++++++`);

        // deteta quando o cliente se desconecta do servidor
        socket.on('disconnect', function () {
            successlog.info(`Client Disconnect...`);
        });

        socket.on('ttsText', function (text) {
            successlog.info(`Text To Speech: ${text}`);
            audioEngine.getData(text, (path) => {
                socket.emit('ttsPath', path);
            });
        });

        socket.on('sensorData', function (data) {
            successlog.info(`Package Number: ${data.counter} - Node ID: ${data.node_id}`);
            rawsensorlib.insert(data, sensors, (result) => {
                rawsensorlib.updateAvg(result, (res) => {
                    result.sensorData.avg = res;
                    sensorlib.update(result);
                });
            });
        });

        socket.on('ttsDelete', function () {
            let deleteFiles = exec('rm -Rf public/dist/static/.temp/*');
            deleteFiles.stdout.on('data', (data) => {
                successlog.info(`Deleted Files: ${data}`);
            });

            deleteFiles.stderr.on('data', (data) => {
                errorLog.error(`Could Not Delete Files: ${data}`);
            });
        });

        // recebe pelo socket a tecla que foi pressionada na interface web 
        // apenas utilizado para simular os evento do comando
        // form utilizadas as teclas 'w' - cima, 's' - baixo, 'a' - esquerda, 'd' - direita, 'z' - enter/ok 
        socket.on("keypress", function (data) {
            keyEvents(data);
        })

        try {
            successlog.info(`Hdmistatus:`);
            successlog.info(`Logical addresses: ${monitor.GetLogicalAddresses().join(', ')}`);
            successlog.info(`Primary logical: ${monitor.GetLogicalAddress()}`);
            successlog.info(`Physical: ${monitor.GetPhysicalAddress()}`);
        } catch (e) {
            errorLog.error(`Error send hdmistatus: ${e.toString()}`);
        }

    });
    cec.on('ready', function (data) {
        successlog.info(`Ready...`);
        sendOutPutMsg('ready', "ready");
    });

    cec.on('status', function (data) {
        sendOutPutMsg('status', data);
    });

    cec.on('key', function (data) {
        keyEvents(data.code);
    });

    cec.on('close', function (code) {
       // process.exit(0);
    });

    cec.on('error', function (data) {
        errorLog.error(`Error: ${data}`);
        sendOutPutMsg('error', data);
    });
}
/**
 * Metodo destinado informar a interface da existência de um aviso
 * @param {*} data 
 */
ServerSktIo.prototype.sendSensorAlert = function (data) {
    if (messageConfirmed) {
        hdmiState('modal');
    }
    vitaWarnings(data);
    messageConfirmed = false;
};

/**
 * TODO: Metodo que se encontra disponivel após a construção deste objecto
 * Destina-se a enviar pelo socket com destino à interface web
 * @param {identificador da comando} tag
 * @param {mensagem} msg
 *  */
ServerSktIo.prototype.sendMsgToPage = function (tag, msg) {
    sendOutPutMsg(tag, msg);
};

module.exports = ServerSktIo;

/**
 * TODO: Função utilizada para encaminhar a mensagem para a interface web
 * @param {identificador da comando} tag
 * @param {mensagem} msg
 */
function sendOutPutMsg(tag, msg) {
    if (sckOn) {
        sckOn.emit(tag, msg);
    }
}

function displayPayload(packet) {
    successlog.info(`Packet: ${JSON.stringify(packet)}`);
    sendOutPutMsg('msgOutput', packet);
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

/**
 * TODO: função destinada a receber o código da tecla utilizado e 
 * consultar a base de dados para encontrar a acção destinada a esse evento
 * @param {codigo da tecla utilizada no controlo remoto} code 
 */
function keyEvents(code) {
    remotelib.getKey(code, function (err, result) {
        if (code && result) {
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
        } else {
            errorLog.error(`Tecla não configurada na base de dados`);
        }
    });

}

/**
 * TODO: Função destinada a encaminha a tecla pressionada 
 * valida se existe algum aviso e só irá encaminha os 
 * eventos enquanto que o aviso não seja retirado
 * @param {código do evento} cmd 
 */
function keyEventProcessing(cmd) {
    if (!messageConfirmed) {
        if (cmd === 'ok_btn') {
            messageConfirmed = true;
            multiMessage = [];
            writeMessage('tx 4F:82:' + modalOldHdmiState + '0:00');
        }
    } else {
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
                successlog.info(`Remote: ${remoteOldHdmiState}`);
                successlog.info(`Modal: ${modalOldHdmiState}`);
                break;
            case "left":    // tecla de direção esquerda ou tecla 'a'
            case "right":   // tecla de direção direita ou tecla 'd'
            case "up":      // tecla de direção cima ou tecla 'w'
            case "down":    // tecla de direção baixo ou tecla 's'
            case "ok_btn":  // tecla central/'OK' ou tecla 'z' 
            case "exit":    // tecla exit' ou tecla 'x'
            case "menu":    // tecla alterar menu' ou tecla 'q'
                sendOutPutMsg('cmd', cmd);
                break;
        }
    }
}

function timer(waitTime) {
    var intervalObject = setInterval(function () {
        timeCount++;
        successlog.info(`Seconds passed since last key pressed: ${timeCount}`);
        if (timeCount == waitTime) {
            successlog.info(`Can press new key.`);
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
        sendOutPutMsg('vitaWarning', data);
    }
}

function reconnect(hdmi, osdName) {
    let restartCec = exec('cec-client -p ' + hdmi + ' -o ' + osdName);
    restartCec.stdout.on('data', (data) => {
        successlog.info(`Restarting Cec: ${data}`);
    });

    restartCec.stderr.on('data', (data) => {
        errorLog.error(`Could Not Restart Cec: ${data}`);
    });
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

    successlog.info(`State: ${hdmi}`);
    successlog.info(`RemoteOldHdmiState: ${remoteOldHdmiState}`);
    successlog.info(`ModalOldHdmiState: ${modalOldHdmiState}`);
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

/*function postControl() {
    sensorlib.getListOfBoardsID(null, (locations) => {
        sensorlib.getListOfSensorsID(null, (sensortypes) => {
            postSensorData(locations, sensortypes, locations.length - 1, sensortypes.length - 1);
        });
    });
    rawsensorlib.delete((result) => {
        successlog.info(`Regists Deleted: ${result}`);
    });
}*/

function postSensorData() {
    rawsensorlib.getDataToPost((result) => {
        if (result.length > 0) {
            result.map((doc) => { dataToSend.push(doc); });
        }
        connectServerlib.postSensorData(null, (data) => {
            if (data.status === 200) {
                rawsensorlib.updateFlg(dataToSend, (modified) => {
                    successlog.info(`Data Modified: ${modified.ok} : ${modified.n} : ${modified.nModified}`);
                    setTimeout(() => {
                        dataToSend = [];
                        postSensorData();
                    }, 5000);
                });
            }
        }, dataToSend);
    });
}

/*function postSensorData(locations, sensortypes, index, i) {
    rawsensorlib.getBySensorIDBoardID(locations[index], sensortypes[i], (result) => {
        if (result.length > 0) {
            result.map((doc) => { dataToSend.push(doc); });
        }
        if (index === 0 && i === 0) {
            connectServerlib.postSensorData(null, (data) => {
                if (data.status === 200) {
                    rawsensorlib.updateFlg(dataToSend, (modified) => {
                        successlog.info(`Data Modified: ${modified.ok} : ${modified.n} : ${modified.nModified}`);
                        setTimeout(() => {
                            dataToSend = [];
                            postSensorData(locations, sensortypes, locations.length - 1, sensortypes.length - 1);
                        }, 5000);
                    });
                }
            }, dataToSend);
        } else {
            i === 0 ? postSensorData(locations, sensortypes, --index, sensortypes.length - 1) : postSensorData(locations, sensortypes, index, --i);
        }
    });
}*/