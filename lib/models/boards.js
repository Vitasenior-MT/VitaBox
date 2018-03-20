'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var BoardSensorsSchema = new Schema({
  id: { type: String, required: true },
  transducer: { type: String, required: true },
  measure: { type: String, required: true },
  min_acceptable: { type: Number, required: true },
  max_acceptable: { type: Number, required: true },
  min_possible: { type: Number, required: true },
  max_possible: { type: Number, required: true }
}, { _id: false, versionKey: false });

var BoardModelSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  Sensors: [BoardSensorsSchema]
}, { _id: false, versionKey: false });

var BoardSchema = new Schema({
  id: { type: String, required: true },
  location: { type: String, required: true },
  mac_addr: { type: String, required: true },
  created_at: { type: Date, required: true },
  node_id: { type: String, required: true },
  Boardmodel: [BoardModelSchema]
}, { _id: false, versionKey: false });

var Board = function () {
  this.boarddb = mongoose.model('Board', BoardSchema);
};

Board.prototype.count = function (callback) {
  this.boarddb.count(function (err, board) {
    if (err) {
      return console.log("Error", err);
    }
    if (board <= 0) {
      callback();
    }
  });
};

Board.prototype.update = function (data, res) {
  this.boarddb.updateMany(data.boards, (err, result) => { });
};

Board.prototype.insert = function (data, callback) {
  this.boarddb.insertMany(data.boards, (err, result) => { err ? callback(err, null) : callback(null, result); });
};

module.exports = Board;
