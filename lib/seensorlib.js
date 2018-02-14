'use strict'
var Sensor = require('./models/sensors.js'),
  locationLib = require('./locationlib.js');

module.exports = {
  createSensorObj: function(skt){
    Sensor = new Sensor(skt);
  },
  postSensor : function(req, res){
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
        id: sensors.id,
        values: sensorData,
        location: sensors.local
    }
    Sensor.insertOrUpdateSensor(data, res);
  },
  getSensorsFromPlace: function(req, res){
    locationLib.getLocationName(req.params.place, res, function(placename){
      Sensor.findSensoresInPlace(placename, res);
    });
  },
  getSensorsValuesFromPlace: function(req, res){
    locationLib.getLocationName(req.params.place, res, function(placename){
      Sensor.findAllValuesSensorInPlace(placename, req.params.sensor, res);
    });
  }
}
