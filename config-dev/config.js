'use strict'
var fs = require('fs'),
  errorLog = require('../lib/logger').errorlog;

module.exports = {
  coapConfigs: {
    rate: {
      hour: 0,
      min: 1,
      sec: 0
    },
    warningArraySize: 5,
    avgSize: 15
  },
  postRate: {
    hour: 0,
    min: 1,
    sec: 0,
    noData: {
      hour: 0,
      min: 5,
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
  TimersConfig: {
    interfaceReset: {
      hour: 0,
      min: 2,
      sec: 0
    },
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
    host: '192.168.161.197'
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
    port: 8080,
    host: '192.168.161.94'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBoxDev2'
}
