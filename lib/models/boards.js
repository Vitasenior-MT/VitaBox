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
  location: { type: String, required: false },
  mac_addr: { type: String, required: true },
  created_at: { type: Date, required: true },
  node_id: { type: String, required: true },
  Boardmodel: [BoardModelSchema]
}, { _id: false, versionKey: false });

var Board = function () {
  this.boarddb = mongoose.model('Board', BoardSchema);
};

Board.prototype.insert = function (data, callback) {
  this.boarddb.remove({}, () => {
    this.boarddb.insertMany(data.boards, (result) => {
      callback(null, result)
    }, error => { callback(err, null) });
  }, error => { callback(err, null) });
};

module.exports = Board;
