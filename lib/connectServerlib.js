'use strict'
var ConnectServer = require('./connectServer');
ConnectServer = new ConnectServer();

module.exports = {
  startConnectServer: () => {
    ConnectServer = new ConnectServer();
  },
  setToken: () => {
    ConnectServer.setToken();
  },
  postSettings: (req, res) => {
    ConnectServer.postSettings(res);
  },
  postSensorData: (req, res) => {
    ConnectServer.postSensorData(res);
  },
  getBoards: (req, res) => {
    ConnectServer.getBoards(res);
  },
  getBoards2: (callback) => {
    ConnectServer.getBoards2(callback);
  },
  getPatients: (req, res) => {
    ConnectServer.getPatients(res);
  },
  getPatients2: (callback) => {
    ConnectServer.getPatients2(callback);
  },
  getPatientsData: (req, res) => {
    ConnectServer.getPatientsData(req, res);
  },
  getSettings: (req, res) => {
    ConnectServer.getSettings(res);
  },
  getSettings2: (callback) => {
    ConnectServer.getSettings2(callback);
  },
  requestToken: (req, res) => {
    ConnectServer.requestToken(res);
  },
  requestToken2: (callback) => {
    ConnectServer.requestToken2(callback);
  }
};