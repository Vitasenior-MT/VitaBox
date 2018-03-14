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
  postSettings: () => {
    ConnectServer.postSettings();
  },
  postSensorData: () => {
    ConnectServer.postSensorData();
  },
  getBoards: () => {
    ConnectServer.getBoards();
  },
  getPatients: () => {
    ConnectServer.getPatients();
  },
  getSettings: () => {
    ConnectServer.getSettings();
  },
  requestToken: (req, res) => {
    ConnectServer.requestToken(res);
  },
  requestToken2: (req, res) => {
    ConnectServer.requestToken(res);
  }
};