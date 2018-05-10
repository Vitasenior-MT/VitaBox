'use strict'
var Sensor = require('./models/sensors.js');
Sensor = new Sensor();

module.exports = {
  getSensors: function (res) {
    Sensor.getSensors(res);
  },
  getAllSensorsInfo: function (req, res) {
    Sensor.getAllSensorsInfo(res);
  },
  getAllCriticalSensors: function (req, res) {
    Sensor.getAllCriticalSensors(req.params.critLevel, res);
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
  update: function (data, res, functions) {
    Sensor.update(data, res, functions);
  }
}
