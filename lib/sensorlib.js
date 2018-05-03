'use strict'
var Sensor = require('./models/sensors.js');

module.exports = {
  createSensorObj: function (skt) {
    Sensor = new Sensor(skt);
  },
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
  update: function (data, res) {
    Sensor.update(data, res);
  }
}
