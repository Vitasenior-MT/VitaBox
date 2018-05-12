'use strict'
// var SensorBle = require('./models/sensorBle.js');
var RawSensor = require('./models/rawsensors.js');
RawSensor = new RawSensor();

module.exports = {
  /**
   * TODO: Método que recebe um objecto com a informação do sensor e dos seus trndutores para serem guardados na base de dados.
   */
  insertBleData: function (data) {
    /*
    let dataSave = {
      pacientId: data.pacientId,
      node_id: data.node_id,
      name: data.name,
      values: []
    }
    data: {
      board_id: sensors[data.node_id].board_id,
        sensor_id: sensors[data.node_id].sensorID[data.sensortype].sensor_id,
          datetime: data.datetime,
            value: data.value
    }
    RawSensor.insertMany();
    */
    for (let index in data.dataBle) {
      console.log("Data", data.dataBle[index]);

    }
    
  },
  /*
  
  SensorBle.insertOrUpdate(dataSave);
  getSensorsbleIdAllData: function (req, res) {
    SensorBle.getDataSensorsbleId(req.params.id, res);
  }
  */
}