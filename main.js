'use strict'
require('colors');
var cp = require('child_process'),
  fs = require('fs'),
  config = null,
  mode = process.env.NODE_ENV || "DEV";

var Main = function () {
  let pathCfg =  './config-' + mode.toLowerCase() + '/config.js';
  console.log('Path Config -',pathCfg);
  config = require(pathCfg);

  var args = {
    port: config.serverHttp.port,
    mongodb: config.mongodb,
    env_dev: (mode.toLowerCase() === 'dev' ? true : false),
  };
  // inicia p script e envia as configuracores do ficheiro ini
  var child2 = cp.fork('./lib/server.js');
  child2.send({ "serverdata": args });
};

new Main();

module.exports = Main;
