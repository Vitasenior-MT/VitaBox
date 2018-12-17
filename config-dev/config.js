'use strict'
var fs = require('fs');

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
  RemoteConfigs: {
    remoteserver: "192.168.161.132",
    remoteport: 8080
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
    host: 'vitasenior-ws.eu-gb.mybluemix.net'
  },
  ServerConfigs: {
    key: (function () {
      try {
        return fs.readFileSync('.key').toString().trim()
      } catch (e) {
        console.log("Error file .key", e.toString())
        return ""
      }
    })(),
    pass: (function () {
      try {
        return fs.readFileSync('.pass').toString().trim()
      } catch (e) {
        console.log("Error file .pass", e.toString())
        return 'passvita'
      }
    })(),
    port: 443,
    host: 'vitasenior-test.eu-gb.mybluemix.net'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBox'
}
