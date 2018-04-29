'use strict'
var Board = require('./models/boards.js'),
  Sensor = require('./models/sensors.js');
Board = new Board();
Sensor = new Sensor();

module.exports = {
  postBoards: function (req, res) {
    Board.insert(data, (err, result) => {
    });
  },
  postBoards2: function (data, callback) {
    Board.insert(data, (err, result) => {
      console.log(data.boards);
      console.log(err);
      console.log(result);
      Sensor.insertOrUpdateSensor(data);
    });
  },
  findMacAddressDevice: function (disp, patientinfo, res, callback) {
    Board.findMacAddressDevice(disp, patientinfo, res, callback);
    
  }
}
