'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Sensor = require('./sensors.js'),
  ObjectId = Schema.ObjectId;
Sensor = new Sensor();

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
  Sensor.insertOrUpdateSensor(data, () => {
    console.log('yah');
  });
  this.boarddb.insertMany(data.boards, (err, result) => { err ? callback(err, null) : callback(null, result); });
};

Board.prototype.insertOrUpdateSensor = function (data, callback) {
  /*let data = data.boards;
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  for (var index = 0; index < data.length; index++) {
    let sensors = {
      id: data[index].id,
      node_id: data[index].node_id,
      location: data[index].location,
      values: []
    };
    if (data[index].Boardmodel.Sensors.length > 0) {
      let sensor = data[index].Boardmodel.Sensors;
      for (var i = 0; i < sensor.length; i++) {
        sensors.values.push({
          sensortype: sensor[i].tag,
          threshold_flg: data[index].Boardmodel === 'environmental' ? true : false,
          threshold: {
            min_acceptable: sensor[i].min_acceptable,
            max_acceptable: sensor[i].max_acceptable,
            min_possible: sensor[i].min_possible,
            max_possible: sensor[i].max_possible
          },
          value: []
        });
      }
      this.boarddb.findOneAndUpdate({ id: sensors.id }, sensors, options, (err, result) => {
        if (err) {
          return console.log('findOneAndUpdate error', err);
        }
        console.log(result);
      });
    }
  }*/
};

module.exports = Board;
