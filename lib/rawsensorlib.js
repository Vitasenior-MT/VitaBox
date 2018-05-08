'use strict'
var RawSensor = require('./models/rawsensors.js');
RawSensor = new RawSensor();
module.exports = {
  insert: function (data, sensors, callback) {
    if (sensors[data.node_id]) {
      if (sensors[data.node_id].sensorID[data.sensortype]) {
        RawSensor.insert({
          data: {
            board_id: sensors[data.node_id].board_id,
            sensor_id: sensors[data.node_id].sensorID[data.sensortype].sensor_id,
            datetime: data.datetime,
            value: data.value
          },
          sensorData: sensors[data.node_id].sensorID[data.sensortype]
        }, callback);
      }
    }
  },
  updateAvg: function (data, callback) {
    RawSensor.updateAvg(data.data, callback);
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
  delete: function (data) {
    RawSensor.delete(data);
  }
}