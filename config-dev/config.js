'use strict'
var fs = require('fs');

module.exports = {
  RemoteConfigs: {
    remoteserver: "192.168.161.132",
    remoteport: 8080
  },
  ServerBoardListenerConfigs: {
    port: 10000,
    host: 'fd00::1'
  },
  ServerSensorRegisterConfigs: {
    port: 10001,
    host: 'fd00::1'
  },
  ServerConfigs: {
    key: fs.readFileSync('key.key').toString().trim(),
    pass: 'passvita',
    port: 8080,
    //host: '192.168.161.117'
    host: '192.168.161.67'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBox'
}
