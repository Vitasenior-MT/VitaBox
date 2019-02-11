'use strict'
var RawSensor = require('./models/rawsensors.js'),
  sensorLib = require('./sensorlib.js');

RawSensor = new RawSensor();
module.exports = {
  updateAvg: function (data, callback) {
    RawSensor.updateAvg(data, callback);
  },
  updateFlg: function (data, callback) {
    RawSensor.updateFlg(data, callback);
  },
  getByBoardID: function (board_id, callback) {
    RawSensor.getByBoardID(board_id, callback);
  },
  getBySensorID: function (sensor_id, callback) {
    RawSensor.getBySensorID(sensor_id, callback);
  },
  getBySensorIDBoardID: function (board_id, sensor_id, callback) {
    RawSensor.getBySensorIDBoardID(board_id, sensor_id, callback);
  },
  getDataToPost: function (callback) {
    RawSensor.getDataToPost(callback);
  },
  getSensorData: function (req, res) {
    RawSensor.getSensorData(res);
  },
  avgOutExpiredData: function (board_id, sensor_id, callback) {
    RawSensor.avgOutExpiredData(board_id, sensor_id, callback);
  },
  delete: function (data) {
    RawSensor.delete(data);
  },
  insertManyData: function (data) {
    RawSensor.insertMany(data);
  },
  getSensorsbleIdAllData: function (req, res) {
    RawSensor.getSensorsByIdAllData(req.params.id, req.params.limit, res);
  },
  getSensorsbleIdLastData: function (id, action, res, callback) {
    RawSensor.getSensorsByIdLastData(id, action, res, callback);
  },
  getSensorDataByType: function (req, res) {
    RawSensor.getSensorDataByType(req.params.type, res);
  },
  getSensorDataByTypeAndLocation: function (req, res) {
    RawSensor.getSensorDataByTypeAndLocation(req.params.type, req.params.location, res);
  },
  getSensorDataByTypeAndLocationV2: function (req, res) {
    sensorLib.getSensorLimits(req.params.type, req.params.location, res, function(dataSnr) {
      RawSensor.getSensorDataByTypeAndLocationV2(dataSnr, req.params.type, req.params.location, res);
    });  
  },
  postSensorData: function (callback) {
    RawSensor.postSensorData(callback);
  }
}