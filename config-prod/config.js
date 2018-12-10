'use strict'
var fs = require('fs');

module.exports = {
  coapConfigs: {
    rate: {
      hour: 0,
      min: 5,
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
    host: 'vitasenior-ws-test.eu-gb.mybluemix.net/socketio'
    //host: 'http://192.168.161.115:8008/socketio'
  },
  ServerConfigs: {
    key: fs.readFileSync('.key').toString().trim(),
    pass: 'p4Fx93OKJN',
    //pass: 'passvita',
    port: 443,
    host: 'vitasenior-api-test.eu-gb.mybluemix.net'
    //port: 8080,
    //host: '192.168.161.94'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBoxProd2'
}