'use strict'
var fs = require('fs');

module.exports = {
  ServerBoardListenerConfigs: {
    port: 10000,
    host: 'fd00::1',
    remoteserver: "192.168.161.132",
    remoteport: 8080
  },
  ServerConfigs: {
    key: fs.readFileSync('key.key').toString().trim(),
    port: 8080,
    host: '192.168.161.151'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBox'
}
