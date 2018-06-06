'use strict'
var RawSensor = require('./models/rawsensors.js');
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
  getSensorDataByType: function (req, res) {
    RawSensor.getSensorDataByType(req.params.type, res);
  }
}