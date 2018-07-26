'use strict'
var sckOn = null;
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var NodeCEC = require('./nodecec.js'),
  c = require('./cecModels.js'),
  utils = require('./utils.js'),
  CEC = c.CEC,
  CECMonitor = c.CECMonitor,
  stdin = process.openStdin(),
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
  exec = require('child_process').exec,
  audioEngine = require('./audioEngine/audioEngine.js'),
  keyEventRelease = true,
  timeCount = 0,
  timeToWait = 1000,
  waitingTimeTillNextWarning = utils.timeCalculator(0, 0, 10), // In case the configs fail the time wont be messed up
  waitingTimeTillCheckForCecIsAlive = utils.timeCalculator(0, 0, 4), // In case the configs fail the time wont be messed up
  waitingTime = 1,
  messageConfirmed = true,
  messageTimeout = false,
  remoteOldHdmiState = 0,
  tvInfo = false,
  interval = null,
  modalOldHdmiState = 0;
// start cec connection
cec.start();

/**
 * TODO: Criação do socket que será utilizado pelo servidor para comunicar com o cliente
 * @param {*} options servidor express
 */
var ServerSktIo = function (options) {
  this.TimersConfig = options.TimersConfig;
  this.server = options.server;
  waitingTimeTillNextWarning = utils.timeCalculator(this.TimersConfig.waitingTimeTillNextWarning.hour, this.TimersConfig.waitingTimeTillNextWarning.min, this.TimersConfig.waitingTimeTillNextWarning.sec);
  waitingTimeTillCheckForCecIsAlive = utils.timeCalculator(this.TimersConfig.waitingTimeTillCheckForCecIsAlive.hour, this.TimersConfig.waitingTimeTillCheckForCecIsAlive.min, this.TimersConfig.waitingTimeTillCheckForCecIsAlive.sec);
};

monitor.once(CECMonitor.EVENTS._READY, function () {
  functions.address();
  setTimeout(function () {
    successlog.info(`Active Source: ${functions.power(0)}`);
    successlog.info(`Active Source: ${monitor.GetPowerStatus(0)}`);
    if (monitor.GetPowerStatus(0) === 153) {
      reconnect(2, 'vitaBox');
    }
  }, waitingTimeTillCheckForCecIsAlive);
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

//ver que é que is to faz
stdin.on('data', function (chunk) {
  console.log('data: -> ', chunk);
  cec.send(chunk);
});

/**
 * TODO: Inicialização do servidor
 */
ServerSktIo.prototype.init = function () {
  var self = this;
  this.io = this.server.io;
  cecSkt();


  // Fired upon a connection
  this.io.on("connection", function (socket) {
    sckOn = socket;

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
}

/**
 * Metodo destinado informar a interface da existência de um aviso
 * @param {*} data 
 */
ServerSktIo.prototype.sendSensorAlert = function (data) {
  if (!messageTimeout) {
    if (messageConfirmed) {
      hdmiState('modal');
    }
    vitaWarnings(data);
    tvInfo = false;
    messageConfirmed = false;
  }
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
      clearInterval(interval);
      if (tvInfo) {
        tvInfo = false;
        sendOutPutMsg('informationVita', {
          shortMessage: 'Ver Mensagem',
          longMessage: 'Pressione [OK] para desbloquear o comando da tv.'
        });
      } else {
        messageConfirmed = true;
        sendOutPutMsg('informationVita', {
          shortMessage: 'Menssagem',
          longMessage: 'Pressione [OK] para desbloquear o comando da tv.'
        });
        messageTimeout = true;
        setTimeout(() => {
          messageTimeout = false;
        }, waitingTimeTillNextWarning);
        sendOutPutMsg('unblock');
      }
      if (modalOldHdmiState > 0) {
        writeMessage('tx 4F:82:' + modalOldHdmiState + '0:00');
      } else {
        writeMessage('as');
      }
    } else {
      sendOutPutMsg('blocked');
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
      case "message":
        blinkMessage('Ver mensagem');
        break;
      case "left":    // tecla de direção esquerda ou tecla 'a'
      case "right":   // tecla de direção direita ou tecla 'd'
      case "up":      // tecla de direção cima ou tecla 'w'
      case "down":    // tecla de direção baixo ou tecla 's'
      case "ok_btn":  // tecla central/'OK' ou tecla 'z' 
      case "exit":    // tecla exit' ou tecla 'x'
      case "mode":    // tecla exit' ou tecla 'c'
      case "settings":
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
      var physAddress = (monitor.GetActiveSource() === null) ? 0 : monitor.GetActiveSource().split('.')[0];
      hdmiCurrentState({ 'PhysAddress': physAddress }, type);
    } catch (e) {
      hdmiCurrentState({ 'PhysAddress': 0 }, type);
    }
  }
}

function blinkMessage(text) {
  clearInterval(interval);
  let addr = (monitor.GetActiveSource() === null) ? 0 : monitor.GetActiveSource().split('.')[0];
  if (parseInt(addr) === 1) {
    interval = setInterval(() => {
      OSTDstring(text);
    }, 3500);
  } else {
    sendOutPutMsg('informationVita', {
      shortMessage: 'Ver Mensagem',
      longMessage: 'Pressione [OK] para desbloquear o comando da tv.'
    });
  }
}

function OSTDstring(text) {
  var msg = text.toString().trim();
  var msg2 = "";
  for (var i = 0; i < msg.length; i++) {
    msg2 += msg.charCodeAt(i).toString(16) + ":";
  }
  var physAddress = (monitor.GetActiveSource() === null) ? 0 : monitor.GetActiveSource().split('.')[0];
  monitor.WriteRawMessage("tx " + physAddress + "0:64:00:" + msg2.slice(0, msg2.length - 1));
  messageConfirmed = false;
  if (messageConfirmed) {
    hdmiState('modal');
  }
  tvInfo = true;
}

function cecSkt() {
  cec.on('ready', function (data) {
    successlog.info(`Ready...`);
    sendOutPutMsg('ready', "ready");
  });

  cec.on('status', function (data) {
    successlog.info(`Status: ${data}`);
    sendOutPutMsg('status', data);
  });

  cec.on('key', function (data) {
    successlog.info(`Key info: ${data}`);
    keyEvents(data.code);
  });

  cec.on('close', function (code) {
    errorLog.error(`Error: ${code}`);
    // process.exit(0);
  });

  cec.on('error', function (data) {
    errorLog.error(`Error: ${data}`);
    sendOutPutMsg('error', data);
  });
}