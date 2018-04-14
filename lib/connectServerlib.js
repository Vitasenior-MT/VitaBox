'use strict'
var ConnectServer = require('./connectServer'),
  remotelib = require('./remotelib.js'),
  sensorlib = require('./sensorlib.js'),
  patientslib = require('./patientslib.js');
ConnectServer = new ConnectServer();

module.exports = {
  postSettings: (req, res) => {
    remotelib.getSettings(function (err, result) {
      err ? console.log('error ', err) : ConnectServer.postSettings(null, res, result);
    });
  },
  postSensorData: (req, res) => {
    sensorlib.getSensorData(null, function (result) {
      console.log(result);
      ConnectServer.postSensorData(null, res, result);
    });
  },
  getBoards: (req, res) => {
    ConnectServer.getBoards(null, res);
  },
  getPatients: (req, res) => {
    ConnectServer.getPatients(null, res);
  },
  getSettings: (req, res) => {
    ConnectServer.getSettings(null, res);
  },
  requestToken: (req, res) => {
    ConnectServer.requestToken(null);
  }
};