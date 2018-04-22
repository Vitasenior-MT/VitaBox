'use strict'
var SensorBle = require('./models/sensorBle.js');

SensorBle = new SensorBle();

module.exports = {
  /**
   * TODO: Método que recebe um objecto com a informação do sensor e dos seus trndutores para serem guardados na base de dados.
   */
  insertBleData: function(data){      
    let dataSave = {
      pacientId: data.pacientId,
      node_id: data.node_id,
      name: data.name,
      values: []
    }
    for (let index in data.dataBle) {
      if (data.dataBle[index].sensortype) {
        dataSave.values.push({
          sensortype: data.dataBle[index].sensortype,
          value: {
              value: data.dataBle[index].value,
              time: Date.now()
            }
        })       
      }
    }
    SensorBle.insertOrUpdate(dataSave);  
  }
}