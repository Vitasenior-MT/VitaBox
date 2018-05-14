'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * TODO: Schema of the table
 */
var RawSensorSchema = new Schema({
  id: { type: String },
  transducer: { type: String, required: true },
  location: { type: String },
  board_id: { type: String, required: true },
  sensor_id: { type: String, required: true },
  datetime: { type: Date, required: true },
  value: { type: Number, required: true },
  bio: { type: Boolean, default: false },
  flg_available: { type: Boolean, default: true },
  flg_avg: { type: Boolean, default: false },
});

/**
 * TODO: Inicialize the model
 */
var RawSensor = function () {
  this.rawsensordb = mongoose.model('RawSensor', RawSensorSchema);
};

/**
 * TODO: Insert vários documentos
 * @param { Data from the sensors } data
 */
RawSensor.prototype.insertMany = function (data) {
  this.rawsensordb.insertMany(data, function (err, result) {
    if (err) {
      return console.log("error", err);
    }
    console.log("Sensor many OK");
  });
};

/**
 * TODO: 
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
    if (err) {
      return console.log("Error", err);
    }
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
  let startDate = new Date(new Date().getTime() - ((24 * 3600) * 1000));
  var query = [{
    $match: { datetime: { $lte: startDate } }
  }, {
    $match: { flg_available: false }
  }, {
    $group: {
      _id: null,
      ids: { $push: '$_id' }
    }
  }];
  this.rawsensordb.aggregate(query, (err, data) => {
    if (err) {
      return console.log("Error", err);
    }
    if (data.length > 0) {
      self.rawsensordb.remove({ '_id': { $in: data[0].ids } }, (err, removed) => {
        if (removed.result.ok === 1) {
          callback(removed);
        }
      });
    }
  });
};

/**
 * TODO: Deletes all the values that expire one day limit
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.avgOutExpiredData = function (board_id, sensor_id, callback) {
  var self = this;
  let startDate = new Date(new Date().getTime() - ((24 * 3600) * 1000));
  var query = [{
    $match: { datetime: { $lte: startDate } }
  }, {
    $match: { sensor_id: sensor_id }
  }, {
    $match: { board_id: board_id }
  }, {
    $match: { flg_available: true }
  }, {
    $match: { flg_avg: false }
  }, {
    $sort: { datetime: 1 }
  }, {
    $project: {
      value: '$value',
      datetime: '$datetime'
    }
  }, {
    $group: {
      _id: null,
      ids: { $push: '$_id' },
      datetimeLast: { $last: '$datetime' },
      avg: { $avg: '$value' }
    }
  }];
  this.rawsensordb.aggregate(query, (err, data) => {
    if (err) {
      return console.log("Error", err);
    }
    if (data.length > 0) {
      self.insert({
        data: {
          board_id: board_id,
          sensor_id: sensor_id,
          datetime: data[0].datetimeLast,
          value: data[0].avg,
          flg_available: true,
          flg_avg: true,
          bio: false
        }
      }, (inserted) => {
        self.rawsensordb.remove({ '_id': { $in: data[0].ids } }, (err, removed) => {
          if (err) {
            return console.log("Error", err);
          }
          if (removed.result.ok === 1) {
            callback(removed);
          }
        });
      });
    }
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
    if (err) {
      return console.log("Error", err);
    }
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
    if (err) {
      return console.log("Error", err);
    }
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
    if (err) {
      return console.log("Error", err);
    }
    callback(result);
  });
};

/**
 * TODO: Gets all the values from the table with flg_available false
 * @param { Is invoked after the query } callback
 */
RawSensor.prototype.getDataToPost = function (callback) {
  this.rawsensordb.find({ flg_available: true }, { value: 1, datetime: 1, _id: 1, sensor_id: 1, board_id: 1 }).limit(100).sort({ datetime: 1 }).exec((err, result) => {
    if (err) {
      return console.log("Error", err);
    }
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

RawSensor.prototype.getSensorsByIdAllData = function (id, limit, res) {
  let query = [{
    $match: { id: id }
  }, {
    $sort: { datetime: -1 }
  }, {
    $group: {
      _id: '$transducer',
      value: { $push: '$value' },
      time: { $push: '$datetime' },
      sensortype: { $last: '$transducer' }
    }
    }, {
      $sort: { datetime: 1 }
    }];
  this.rawsensordb.aggregate(query, (err, dataSensor) => {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    if (dataSensor.length === 0) {
      return res.json({
        status: false,
        data: "Não existe dados de histórico para o exame."
      });
    }
    let resultVals = [];
    for (let index = 0; index < dataSensor.length; index++) {
      resultVals.push({
        sensortype: dataSensor[index].sensortype,
        value: []
      });
      var sizeVals = dataSensor[index].value.length > limit ? limit : dataSensor[index].value.length
      for (let i = sizeVals - 1; i >= 0; i--) {
        resultVals[index].value.push({
          value: dataSensor[index].value[i],
          time: dataSensor[index].time[i]
        })
      }
    }
    res.json({
      status: true,
      data: resultVals
    });
  });
}

RawSensor.prototype.countDataRawSensorBio = function (callback) {
  this.rawsensordb.count({ bio: true }, function (err, result) {
    if (err) {
      return console.log("Error", err);
    }
    if (result <= 0) {
      callback();
    }
  });
}

RawSensor.prototype.getSensorDataByType = function (type, res) {
  let query = [{
    $match: { 
      transducer: type, 
      bio: false, 
      datetime: {
        $gt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    }
  }, {
    $sort: { datetime: 1 }
  }, {
    $group: {
      _id: {
        board_id: "$board_id",
        sensor_id: "$sensor_id"
      },
      value: { $push: '$value' },
      time: { $push: '$datetime' },
      sensortype: { $last: '$transducer' },
      location: { $last: '$location' }
    }
  }];
  this.rawsensordb.aggregate(query, function (err, result) {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    if (result.length === 0) {
      return res.json({
        status: false,
        data: "Não existe dados de histórico para o exame."
      });
    }
    res.json({
      status: true,
      data: result
    });
  });
}

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