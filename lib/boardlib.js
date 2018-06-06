'use strict'
var Board = require('./models/boards.js'),
  Sensor = require('./models/sensors.js');
Board = new Board();
Sensor = new Sensor();

module.exports = {
  postBoards: function (data, callback) {
    Board.insert(data.boards, (err, result) => {
      Sensor.create(data, callback);
    });
  },

  findMacToAllDevice: function (res, arrListExam) {
    Board.findMacToAllDevice(res, arrListExam);
  }
}
