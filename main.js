'use strict'
require('colors');
var cp = require('child_process'),
  fs = require('fs'),
  config = require('./config.js');

var Main = function () {
  var args = {
    port: config.serverHttp.port,
    mongodb: config.mongodb,
    boardConfig: {
      serverBoardListenerConfigs: config.ServerBoardListenerConfigs,
      serverSensorRegisterConfigs: config.ServerSensorRegisterConfigs,
      remoteConfigs: config.RemoteConfigs
    }
  };
  // inicia p script e envia as configuracores do ficheiro ini
  var child2 = cp.fork('./lib/server.js');
  child2.send({ "serverdata": args });
};

new Main();

module.exports = Main;
