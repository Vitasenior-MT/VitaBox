'use strict'
var Sensor = require('./models/sensors.js');

module.exports = {
  createSensorObj: function (skt) {
    Sensor = new Sensor(skt);
  },
  postSensor: function (req, res) {
    var sensors = req.body;
    var sensorData = [];
    var sensor = sensors.sensores;
    for (var index = 0; index < sensor.length; index++) {
      sensorData.push({
        sensortype: sensor[index].sensortype,
        value: {
          time: Date.now(),
          value: sensor[index].sensorvalue
        }
      });
    }
    var data = {
      node_id: sensors.node_id,
      values: sensorData
    }
    console.log(sensors);
    Sensor.addValues(data, res);
  },
  getAllCriticalSensors: function (req, res) {
    Sensor.getAllCriticalSensors(req.params.critLevel, res);
  },
  getAllSensoresPlaceInfo: function (req, res) {
    Sensor.getAllSensorsByLocation(res);
  },
  getAllSensoresInfo: function (req, res) {
    Sensor.getAllInfoSensorsAllPlaces(res);
  },
  getSensorData: function (req, res) {
    Sensor.getSensorData(res);
  },
  getByNodeId: function (node_id, callback) {
    Sensor.getByNodeId(node_id, callback);
  },
  getPlaceSensores: function (req, res){
    Sensor.getPlaceSensores(res);
  },
  getAllDataFromSensor: function (req, res){
    Sensor.getAllDataFromSensor(req.params.place, req.params.sensor, res);
  }
}
