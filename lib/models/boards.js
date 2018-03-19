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
  location: { type: String },
  mac_addr: { type: String, required: true },
  created_at: { type: Date, required: true },
  Boardmodel: [BoardModelSchema]
}, { _id: false, versionKey: false });

var Board = function () {
  this.boarddb = mongoose.model('Board', BoardSchema);
};

Board.prototype.findUpdateCreate = function (data, res) {
  console.log('data');
  console.log(data);
  if (data.id) {
    var query = { id: data.id },
      options = { upsert: true, new: true, setDefaultsOnInsert: true },
      update = {
        id: data.id,
        location: data.location,
        mac_address: data.mac_address,
        created_at: data.created_at,
        Boardmodel: data.Boardmodel
      };
    this.boarddb.updateMany(update, options, (err, result) => { });
    //this.boarddb.findOneAndUpdate(query, update, options, (err, result) => { });
  }
};

Board.prototype.findUpdateCreate2 = function (data, callback) {
  this.boarddb.insertMany(data.boards, (err, result) => { err ? callback(err, null) : callback(null, result); });
};

module.exports = Board;
