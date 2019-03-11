'use strict'
require('colors');
var cp = require('child_process'),
  fs = require('fs'),
  connectDB = require('./lib/connectDB.js'),
  patientslib = require('./lib/patientslib.js'),
  rawsensorlib = require('./lib/rawsensorlib.js'),
  settinglib = require('./lib/settinglib.js'),
  log = require('./lib/logger'),
  errorLog = log.errorlog,
  successlog = log.successlog,
  config = null,
  mode = process.env.NODE_ENV || "DEV";

var Main = function () {
  let pathCfg = './config-' + mode.toLowerCase() + '/config.js';
  successlog.info('Path Config -', pathCfg);
  config = require(pathCfg);
  this.mongodbConfig = config.mongodb;
  this.allPatientes = [];
};

Main.prototype.start = function () {
  var self = this;
  connectDB.connectDB(this.mongodbConfig, function () {
    successlog.info(`DataBase is up.`);
    patientslib.getAllPatientsIdMiBandDevice(function (patients) {
      self.allPatientes = patients;
      if (self.allPatientes.length > 0) {
        self.execBleMiBand(self.allPatientes.pop());
      } else {
        settinglib.updateFlagBandFit({ flag: false }, () => {
          console.log("process End");
          process.exit(0);
        });
      }
    })
  });
}

Main.prototype.execBleMiBand = function (pacientInfo) {
  var self = this;
  var args = {
    options: {
      bandfitness_auth: true // pacientInfo.bandfitness_auth verificar porque não grava
    },
    pacientId: pacientInfo.userId,
    action: pacientInfo.BoardmodelName,
    macAddress: pacientInfo.mac_addr,
    boardId: pacientInfo.boardId,
    deviceId: pacientInfo.deviceId,
    BoardmodelId: pacientInfo.BoardmodelId,
    sensors: pacientInfo.Sensors
  };
  // inicia p script e envia as configuracores do ficheiro inicial
  validate(() => {
    var child = cp.fork('./lib/bleServer.js');
    child.send({ "serverdata": args });
    child.on('message', function (data) {
      if (data.proc === 'saveDataSensors') {
        rawsensorlib.insertManyData(data.dataSend);
      } else if (data.proc === 'saveAuthPatient') {
        patientslib.updateFlagAuthBandFit(data.dataSend);
      }
    });
    child.on('exit', function (data) {
      if (self.allPatientes.length > 0) {
        self.execBleMiBand(self.allPatientes.pop());
      } else {
        settinglib.updateFlagBandFit({ flag: false }, () => {
          console.log("execBleMiBand process End");
          process.exit(0);
        });
      }
    })
  });
}

var m = new Main();
m.start();

module.exports = Main;

var validate = function (callback) {
  settinglib.getFlagBandFit(null, (data) => {
    if (!data[0].flg_bandfitness) {
      settinglib.updateFlagBandFit({ flag: true }, (result) => {
        console.log("execBleMiBand ", result);
        callback();
      });
    } else {
      console.log("BLE ocupado ");
      process.exit(0);
    }
  });
}