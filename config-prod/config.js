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
    port: 8080,
    //port: 443,
    //host: 'vitasenior-test.eu-gb.mybluemix.net'
    host: '192.168.161.53'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBoxProd2'
}
