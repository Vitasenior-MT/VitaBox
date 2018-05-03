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
  postSensorData: (req, res, data) => {
    ConnectServer.postSensorData(null, res, data);
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

var getData = function (res) {
  sensorlib.getSensorData(null, function (result) {
    console.log(result);
    ConnectServer.postSensorData(null, (data) => {
      console.log(data);
      if (data.status === 200) {
        setTimeout(() => {
          getData(res);
        }, 50000);
        sensorlib.updateValues(result, res);
      }
    }, result);
  });
}