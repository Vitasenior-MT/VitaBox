'use strict'
var Board = require('./models/boards.js');
Board = new Board();
module.exports = {
  postBoards: function (req, res) {
    Board.findUpdateCreate(req.body.data, res);
  },
  postBoards2: function (data, callback) {
    Board.count(() => {
      Board.insert(data, callback);
    });
  }
}
