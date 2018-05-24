'use strict'
var fs = require('fs');

module.exports = {
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
    timeTillAvgOutExpiredDate: {
      hour: 0,
      min: 10,
      sec: 0
    },
    deleteRate: {
      hour: 0,
      min: 10,
      sec: 0
    },
    postRate: {
      hour: 0,
      min: 0,
      sec: 5
    }
  },
  RemoteConfigs: {
    remoteserver: "192.168.161.132",
    remoteport: 8080
  },
  ServerBoardListenerConfigs: {
    port: 10000,
    host: 'fd00::1'
  },
  ServerBoardRegisterConfigs: {
    port: 10001,
    host: 'fd00::1'
  },
  ServerConfigs: {
    key: fs.readFileSync('key.key').toString().trim(),
    pass: 'passvita',
    port: 443,
    host: 'vitasenior-test.eu-gb.mybluemix.net'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBoxNEW03'
}
