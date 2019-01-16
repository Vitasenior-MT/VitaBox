'use strict'
var fs = require('fs'),
  errorLog = require('../lib/logger').errorlog;

module.exports = {
  coapConfigs: {
    rate: {
      hour: 0,
      min: 15,
      sec: 0
    }
  },
  postRate: {
    hour: 0,
    min: 5,
    sec: 0,
    noData: {
      hour: 0,
      min: 10,
      sec: 0
    }
  },
  ReconnectRate: {
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
    wifiRetry: {
      hour: 0,
      min: 30,
      sec: 0
    },
    timeToNewAttempt: {
      hour: 0,
      min: 0,
      sec: 10
    },
    waitingTimeTillNextWarning: {
      hour: 0,
      min: 0,
      sec: 50
    },
    waitingTimeTillCheckForCecIsAlive: {
      hour: 0,
      min: 0,
      sec: 4
    },
    deleteRate: {
      hour: 0,
      min: 10,
      sec: 0
    }
  },
  ServerBoardWarningConfigs: {
    port: 10000,
    host: 'fd00::1'
  },
  ServerBoardRegisterConfigs: {
    port: 10001,
    host: 'fd00::1'
  },
  websockets: {
    host: 'https://vitasenior-ws.eu-gb.mybluemix.net/socketio'
  },
  ServerConfigs: {
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
    port: 443,
    host: 'vitasenior-api.eu-gb.mybluemix.net'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBoxProd2'
}