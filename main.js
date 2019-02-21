'use strict'
require('colors');
var cp = require('child_process'),
  fs = require('fs'),
  config = null,
  mode = process.env.NODE_ENV || "DEV",
  log = require('./lib/logger'),
  errorlog = log.errorlog,
	successlog = log.successlog;

var Main = function () {
  successlog.info(`Mode: ${mode}`);
  successlog.info(`ENV: ${process.env}`);
  let pathCfg = './config-' + mode.toLowerCase() + '/config.js';
  successlog.info(`Path Config - ${pathCfg}`);
  config = require(pathCfg);

  var args = {
    port: config.serverHttp.port,
    mongodb: config.mongodb,
    TimersConfig: config.TimersConfig,
    pingConfig: config.pingConfig,
    env_dev: (mode.toLowerCase() === 'dev' ? true : false),
  };
  // inicia p script e envia as configuracores
  var child2 = cp.fork('./lib/server.js');
  child2.send({ "serverdata": args });

};

new Main();

module.exports = Main;