'use strict'
var Board = require('./models/boards.js');
Board = new Board();
module.exports = {
  postBoards: function (req, res) {
    Board.findUpdateCreate(req.body.data, res);
  },
  postBoards2: function (data, callback) {
    Board.findUpdateCreate2(data, callback);
  },
  /*postBoards: function (req, res) {
    let boards = req.body.data;
    for (var index in boards) {
      Board.findUpdateCreate(boards[index], res);
    }
  }*/
}
