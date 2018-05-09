'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * TODO: Schema of the table
 */
var RawSensorSchema = new Schema({
  board_id: { type: String, required: true },
  sensor_id: { type: String, required: true },
  datetime: { type: Date, required: true },
  value: { type: Number, required: true },
  flg_available: { type: Boolean, default: true },
});

/**
 * TODO: Inicialize the model
 */
var RawSensor = function () {
  this.rawsensordb = mongoose.model('RawSensor', RawSensorSchema);
};

/**
 * TODO: Testes
 * @param { Data from the sensors } data
 */
RawSensor.prototype.insertMany = function (data) {
  this.rawsensordb.insertMany(data, function (err, result) { });
};

/**
 * TODO: Testes
 * @param { Data from the sensors } data
 */
RawSensor.prototype.countRawSensors = function (callback) {
  this.rawsensordb.count(function (err, result) {
    if (err) {
      return console.log("Error", err);
    }
    if (result <= 0) {
      callback();
    }
  });
};

/**
 * TODO: Inserts the data from the sensors to the bd
 * @param { Data from the sensors } data
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.insert = function (data, callback) {
  this.rawsensordb.insertMany(data.data, function (err, result) {
    callback(data);
  });
};

/**
 * TODO: Finds all the values with board_id and sensor_id and calculates the avarge
 * @param { Data from the sensors } data
 * @param { Is invoked after the query } callback
 */
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

/**
 * TODO: Updates all the values flags to false from the data
 * @param { Data from the sensors } data
 * @param { Is invoked after the query } res
 */
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

/**
 * TODO: Deletes all the values that expire one day limit
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.delete = function (callback) {
  var self = this;
  let endDate = new Date().getTime();
  let startDate = endDate - ((24 * 3600) * 1000);
  console.log('***********************************************');
  console.log(new Date(startDate));
  console.log(new Date(endDate));
  var query = [{
    $match: { datetime: { $lte: new Date(startDate) } }
  },
  {
    $match: { flg_available: false }
  }];
  this.rawsensordb.aggregate(query, (err, result) => {
    console.log(result);
    self.rawsensordb.remove({ 'datetime': { $in: ids } }, (err, result) => {
      if (result.result.ok === 1) {
        callback(docs);
      }
    });
  });
};

/**
 * TODO: Gets all the values from the board we query (board_id)
 * @param { Id of the board to search } board_id
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.getByBoardID = function (board_id, callback) {
  var self = this;
  this.rawsensordb.find({ board_id: board_id }, (err, result) => {
    callback(result);
  });
};

/**
 * TODO: Gets all the values from the sensor we query (sensor_id)
 * @param { Id of the sensor to search } sensor_id
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.getBySensorID = function (sensor_id, callback) {
  var self = this;
  this.rawsensordb.find({ sensor_id: sensor_id }, (err, result) => {
    callback(result);
  });
};

/**
 * TODO: Gets all the values from the sensor and board we query (sensor_id, board_id)
 * @param { Id of the sensor to search } sensor_id
 * @param { Id of the board to search } board_id
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.getBySensorIDBoardID = function (board_id, sensor_id, callback) {
  var self = this;
  this.rawsensordb.find({ board_id: board_id, sensor_id: sensor_id }, (err, result) => {
    callback(result);
  });
};

/**
 * TODO: Gets all the values from the table with flg_available false
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.getDataToPost = function (callback) {
  this.rawsensordb.find({ flg_available: true }).limit(400).sort({ datetime: 1 }).exec((err, result) => {
    callback(result);
  });
};

/**
 * TODO: Gets all the values from the table with flg_available false
 * @param { Is invoked after the query } res
 */
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

/**
 * TODO: Process the result of the query
 * @param { Is invoked after the query } res
 * @param { Info of the error } err
 * @param { The result of the query } result
 */
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