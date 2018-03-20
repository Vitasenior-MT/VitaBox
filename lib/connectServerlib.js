'use strict'
var ConnectServer = require('./connectServer'),
  remotelib = require('./remotelib.js'),
  patientslib = require('./patientslib.js');
ConnectServer = new ConnectServer();

module.exports = {
  startConnectServer: () => {
    ConnectServer = new ConnectServer();
  },
  setToken: () => {
    ConnectServer.setToken();
  },
  postSettings: (req, res) => {
    remotelib.getSettings(function (err, result) {
      err ? console.log('error ', err) : ConnectServer.postSettings(req, res, result);
    });
  },
  postSensorData: (req, res) => {
    seensorlib.getSensorData2(function (result) {
      let records = result;
      for (var index in records) {
        records[index].board_id = "fd00::212:4b00:60d:60c8";
      }
      ConnectServer.postSensorData(req, res, records);
    });
  },
  getBoards: (req, res) => {
    ConnectServer.getBoards(req, res);
  },
  getPatients: (req, res) => {
    ConnectServer.getPatients(req, res);
  },
  getSettings: (req, res) => {
    ConnectServer.getSettings(req, res);
  },
  requestToken: (req, res) => {
    ConnectServer.requestToken(req, res);
  }
};