'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var RawSensorSchema = new Schema({
  board_id: { type: String, required: true },
  sensor_id: { type: String, required: true },
  datetime: { type: Date, required: true },
  value: { type: Number, required: true },
  flg_available: { type: Boolean, default: true },
});

var RawSensor = function () {
  this.rawsensordb = mongoose.model('RawSensor', RawSensorSchema);
};

RawSensor.prototype.insert = function (data, callback) {
  this.rawsensordb.insertMany(data.data, function (err, result) {
    callback(data);
  });
};

RawSensor.prototype.updateAvg = function (data, callback) {
  var self = this;
  var query = [{
    $match: { board_id: data.board_id }
  }, {
    $match: { 'sensor_id': data.sensor_id }
  }, {
    $sort: { 'datetime': -1 }
  }, {
    $limit: 10
  }, {
    $project: {
      value: '$value'
    }
  }, {
    $group: {
      _id: null,
      avg: { $avg: '$value' }
    }
  }];
  this.rawsensordb.aggregate(query, (err, result) => {
    if (err) {
      return console.log('Sensor agregate error ', err);
    }
    callback(result[0].avg);
  });
};

RawSensor.prototype.updateFlg = function (data, res) {
  var self = this;
  var ids = data.map((doc) => { return doc._id; });
  this.rawsensordb.update({ _id: ids }, { $set: { "flg_available": false } }, { multi: true }, (err, result) => {
    if (err) {
      return console.log('Sensor agregate error ', err);
    }
    sendData(res, err, result);
  });
};

RawSensor.prototype.delete = function (callback) {
  var self = this;
  let endDate = new Date().getTime();
  let startDate = endDate - ((24 * 3600) * 1000);
  console.log('***********************************************');
  console.log(new Date(startDate));
  console.log(new Date(endDate));
  var query = [{
    $match: { datetime: { $lte: new Date(startDate) } }
  }];
  this.rawsensordb.aggregate(query, (err, result) => {
    console.log(result);
    /*self.rawsensordb.remove({ 'datetime': { $in: ids } }, (err, result) => {
      if (result.result.ok === 1) {
        callback(docs);
      }
    });*/
  });
  /*this.rawsensordb.find({}).exec(function (err, docs) {
    console.log(docs);
    let ids = docs.map((doc) => {
      if (new Date(docs.datetime).getTime() > startDate && new Date(docs.datetime).getTime() < endDate) {
      } else {
        return doc.datetime;
      }
    });
    console.log(ids);
    /*self.rawsensordb.remove({ 'datetime': { $in: ids } }, (err, result) => {
      if (result.result.ok === 1) {
        callback(docs);
      }
    });
  });*/
};

RawSensor.prototype.getByBoardID = function (board_id, callback) {
  var self = this;
  this.rawsensordb.find({ board_id: board_id }, (err, result) => {
    callback(result);
  });
};

RawSensor.prototype.getBySensorID = function (sensor_id, callback) {
  var self = this;
  this.rawsensordb.find({ sensor_id: sensor_id }, (err, result) => {
    callback(result);
  });
};

RawSensor.prototype.getBySensorIDBoardID = function (board_id, sensor_id, callback) {
  var self = this;
  this.rawsensordb.find({ board_id: board_id, sensor_id: sensor_id, flg_available: true }).limit(10).sort({ datetime: 1 }).exec((err, result) => {
    callback(result);
  });
};

RawSensor.prototype.getSensorData = function (res) {
  var query = [{
    $match: { sensor_id: '94ef9abb-27a3-4932-ae99-7f4ca810e0fd' }
  }, {
    $project: {
      _id: 0,
      value: 1,
      datetime: 1,
    }
  }, {
    $group: {
      _id: null,
      value: { $push: '$value' },
      datetime: { $push: '$datetime' },
    }
  }];
  this.rawsensordb.aggregate(query, (err, result) => {
    sendData(res, err, result);
  });
};

module.exports = RawSensor;

var sendData = function (res, err, result) {
  if (typeof res === 'function') {
    res(result);
  } else {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    } else {
      return res.json({
        status: true,
        data: result
      });
    }
  }
}