'use strict'
var ConnectServer = require('./connectServer'),
  remotelib = require('./remotelib.js'),
  sensorlib = require('./sensorlib.js'),
  patientslib = require('./patientslib.js');
ConnectServer = new ConnectServer();

module.exports = {
  setToken: (req, res) => {
    ConnectServer.setToken(res);
  },
  postSettings: (req, res) => {
    remotelib.getSettings(function (err, result) {
      err ? console.log('error ', err) : ConnectServer.postSettings(res, result);
    });
  },
  postSensorData: (req, res) => {
    sensorlib.getSensorData(null, function (result) {
      console.log(result);
      ConnectServer.postSensorData(res, result);
    });
  },
  getBoards: (req, res) => {
    ConnectServer.getBoards(res);
  },
  getPatients: (req, res) => {
    ConnectServer.getPatients(res);
  },
  getSettings: (req, res) => {
    ConnectServer.getSettings(res);
  },
  requestToken: (req, res) => {
    ConnectServer.requestToken(res);
  }
};