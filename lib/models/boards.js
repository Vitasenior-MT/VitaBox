'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var SensormodelSchema = new Schema({
  id: { type: String, required: true },
  transducer: { type: String, required: true },
  measure: { type: String, required: true },
  tag: { type: String, required: true },
  min_acceptable: { type: Number, required: false },
  max_acceptable: { type: Number, required: false },
  min_possible: { type: Number, required: false },
  max_possible: { type: Number, required: false }
}, { _id: false, versionKey: false });

var SensorsSchema = new Schema({
  id: { type: String, required: true },
  Sensormodel: [SensormodelSchema]
}, { _id: false, versionKey: false });

var BoardSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: false },
  mac_addr: { type: String, required: true },
  updated_at: { type: Date, required: true },
  node_id: { type: String, required: true },
  Sensors: [SensorsSchema]
}, { _id: false, versionKey: false });

var Board = function () {
  this.boarddb = mongoose.model('Board', BoardSchema);
};

Board.prototype.insert = function (data, callback) {
  var self = this;
  this.boarddb.remove({}, () => {
    self.boarddb.insertMany(data, (result) => {
      if (callback) {
        return callback(null, result);
      }
    }, error => {
      if (callback) {
        return callback(err, null);
      }
      return console.log("error", error);
    });
  }, error => {
    if (callback) {
      return callback(err, null);
    }
    return console.log("error", error);
  });
};

module.exports = Board;
