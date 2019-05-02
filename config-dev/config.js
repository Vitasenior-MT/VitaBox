'use strict'
var fs = require('fs'),
  errorLog = require('../lib/logger').errorlog;

module.exports = {
  coapConfigs: { // configuração de pedidos dos valores aos sensores
    rate: {
      hour: 0,
      min: 1,
      sec: 0
    },
    warningArraySize: 5,
    avgSize: 15
  },
  postRate: { // configuração de envio de dados para a cloud
    hour: 0,
    min: 1,
    sec: 0,
    noData: {
      hour: 0,
      min: 5,
      sec: 0
    }
  },
  ReconnectRate: { // configuração de tentativas de ligação á cloud
    hour: 0,
    min: 0,
    sec: 5,
    extra: {
      hour: 0,
      min: 5,
      sec: 0
    }
  },
  pingConfig: {
    site: '1.1.1.1',
    number: 5
  },
  TimersConfig: {
    pressTimer: 500, // tempo ate aceitar a proxima tecla do comando em ms
    wifiRetry: {
      hour: 0,
      min: 1,
      sec: 0
    },
    timeToNewAttempt: {
      hour: 0,
      min: 0,
      sec: 10
    },
    waitingTimeTillNextWarning: {
      hour: 0,
      min: 5,
      sec: 0
    },
    waitingTimeTillCheckForCecIsAlive: { // tempo de espera para verificação da ligação do cec
      hour: 0,
      min: 0,
      sec: 4
    },
    deleteRate: { // tempo de eliminação dos registos fora de prazo
      hour: 0,
      min: 10,
      sec: 0
    }
  },
  execludeAmbientSensors: 'temp&&humi', // configuração da lista de exclusão dos avisos dos sensores ambientais na página da aplicação
  ServerBoardWarningConfigs: {  // configuração do servidor de avisos dos sensores
    port: 10000,
    host: 'fd00::1',
    sendingHost: 8002
  },
  ServerBoardRegisterConfigs: { // configuração do servidor de registo dos sensores
    port: 10001,
    host: 'fd00::1'
  },
  websockets: {
    host: 'https://vitasenior-ws-test.eu-gb.mybluemix.net/socketio'
  },
  ServerConfigs: { // configuração do servidor principal
    key: (function () {
      try {
        return fs.readFileSync('.key').toString().trim()
      } catch (e) {
        errorLog.error(`Error file .key -> ${e.toString()}`)
        return ""
      }
    })(),
    pass: (function () {
      try {
        return fs.readFileSync('.pass').toString().trim()
      } catch (e) {
        errorLog.error(`Error file .pass -> ${e.toString()}`)
        return ""
      }
    })(),
    peerhost: 'vitasenior-peer-test.eu-gb.mybluemix.net',
    peerport: 443,
    port: 443,
    host: 'vitasenior-api-test.eu-gb.mybluemix.net'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBoxDev'
}
