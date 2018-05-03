'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var BoardSensorsSchema = new Schema({
  id: { type: String, required: true },
  transducer: { type: String, required: true },
  measure: { type: String, required: true },
  tag: { type: String, required: true },
  min_acceptable: { type: Number, required: false },
  max_acceptable: { type: Number, required: false },
  min_possible: { type: Number, required: false },
  max_possible: { type: Number, required: false }
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
  updated_at: { type: Date, required: true },
  node_id: { type: String, required: true },
  Boardmodel: [BoardModelSchema]
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

Board.prototype.findMacAddressDevice = function (deviceble, pacient, res, callback) {
  this.boarddb.find({ "Boardmodel.name": deviceble }, { "mac_addr": 1 }, function (err, data) {
    if (err) {
      return res.json({
        status: false,
        data: err
      })
    }
    if (data.length === 0) {
      return res.json({
        status: false,
        data: "Equipamento não encontado."
      });
    }
    pacient[0].mac_addr = data[0].mac_addr;
    callback(pacient);
  });
}

module.exports = Board;
