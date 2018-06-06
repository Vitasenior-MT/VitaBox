'use strict'
var Sensor = require('./models/sensors.js'),
  sktcon = null;
Sensor = new Sensor();

module.exports = {
  addsktconn: function (skt) {
    sktcon = skt;
  },
  getSensors: function (res) {
    Sensor.getSensors(res);
  },
  getAllSensorsInfo: function (req, res) {
    Sensor.getAllSensorsInfo(res);
  },
  getAllCriticalSensors: function (req, res) {
    Sensor.getAllCriticalSensors(res);
  },
  getAllSensorsByLocation: function (req, res) {
    Sensor.getAllSensorsByLocation(res);
  },
  getSensorsByLocation: function (req, res) {
    Sensor.getSensorsByLocation(res);
  },
  getListOfBoardsID: function (req, res) {
    Sensor.getListOfBoardsID(res);
  },
  getListOfSensorsID: function (req, res) {
    Sensor.getListOfSensorsID(res);
  },
  getByNodeId: function (node_id, callback) {
    Sensor.getByNodeId(node_id, callback);
  },
  getNodeIdList: function (callback) {
    Sensor.getNodeIdList(callback);
  },
  getSensortypeList: function (req, res) {
    Sensor.getSensortypeList(res);
  },
  update: function (warning, data, callback) {
    Sensor.update(warning, data, sktcon, callback);
  },
  getDistictAll: function (req, res) {
    Sensor.getDistictAllSensors(res);
  }
}
