'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  LocationPlace = require('./locationplaces.js'),
  Threshold = require('./thresholds.js');

LocationPlace = new LocationPlace();
Threshold = new Threshold();

var ValueSchema = new Schema({
  value: { type: Number, required: true },
  time: { type: Date, required: true }
}, { versionKey: false });

var ValuesSchema = new Schema({
  sensortype: { type: String, required: true },
  threshold_flg: { type: Boolean, default: false },
  threshold: { type: Number, default: 0 },
  avg: { type: Number, default: 0 },
  avgLastUpdate: { type: Date, default: Date.now, required: true },
  critLevel: { type: Number, default: 0 },
  value: [ValueSchema]
}, { versionKey: false });

var SensorSchema = new Schema({
  id: { type: String, required: true },
  values: [ValuesSchema],
  location: { type: String, required: true }
}, { versionKey: false });

var Sensor = function (skt) {
  this.sensordb = mongoose.model('Sensor', SensorSchema);
  this.sktSend = skt;
}

Sensor.prototype.insertOrUpdateSensor = function (data, res) {
  var self = this;
  var query = { id: data.id },
    options = { upsert: true, new: true, setDefaultsOnInsert: true },
    update = {
      id: data.id,
      location: data.location
    };
  this.sensordb.findOneAndUpdate(query, update, options, (err, result) => {
    if (err) {
      return console.log('findOneAndUpdate error', err);
    }

    if (result.values.length < 1) {
      LocationPlace.findOneLocationPlace(data.location, function (loc) {
        data.values.forEach((element, index) => {
          Threshold.findOneThreshold(element.sensortype, loc, function (thres) {
            result.values.push({
              sensortype: data.values[index].sensortype,
              threshold_flg: true,
              threshold: thres.threshold,
              value: data.values[index].value
            });
            if ((index + 1) === data.values.length) {
              result.save(function (err, sensor) {
                if (err) {
                  return console.log('Sensor save error', err);
                }
                for (var index = 0; index < sensor.values.length; index++) {
                  self.agragateSensorData(sensor.values[index].sensortype, sensor.id, sensor.location);
                }
              });
            }
          });
        });
      });
    } else {
      LocationPlace.findOneLocationPlace(data.location, function (loc) {
        data.values.forEach((element, index) => {
          Threshold.findOneThreshold(element.sensortype, loc, function (thres) {
            var resultData = result.values.contains(element.sensortype);
            if (!resultData.contains) {
              result.values.push({
                sensortype: element.sensortype,
                threshold_flg: true,
                threshold: thres.threshold,
                value: element.value
              });
            } else {
              result.values[resultData.index].value.push(element.value);
            }
            if ((index + 1) === data.values.length) {
              result.save((err, sensor) => {
                if (err) {
                  return console.log('Sensor save error', err);
                }
                for (var index = 0; index < sensor.values.length; index++) {
                  self.agragateSensorData(sensor.values[index].sensortype, sensor.id, sensor.location);
                }
              });
            }
          });
        });
      });
    }
    return res.json({
      status: "success",
      data: "ok"
    });
  });
};

Sensor.prototype.agragateSensorData = function (sensortype, id, location) {
  var self = this;
  var query = [{
    $match: { id: id }
  }, {
    $unwind: '$values'
  }, {
    $unwind: '$values.value'
  }, {
    $match: { 'values.sensortype': sensortype }
  }, {
    $sort: { 'values.value.time': -1 }
  }, {
    $limit: 10
  }, {
    $project: {
      value: '$values.value.value',
      threshold: '$values.threshold'
    }
  }, {
    $group: {
      _id: null,
      threshold: { $last: '$threshold' },
      value: { $push: '$value' },
      avg: { $avg: '$value' }
    }
  }];
  this.sensordb.aggregate(query, (err, result) => {
    if (err) {
      return console.log('Sensor agregate error ', err);
    }
    if (result) {
      self.insertOrUpdateAvg(id, sensortype, result[0]);
      if (result[0].value.length === 10) {
        if (result[0].threshold < result[0].avg) {
          self.sktSend.sendSensorAlert({
            warning_type: sensortype,
            location: location,
            threshold: result[0].threshold,
            avg: result[0].avg
          });
        } else {
          console.log("Not Send MSG.");
        }
      }
    }
  });
};

Sensor.prototype.insertOrUpdateAvg = function (idsensor, sensortype, data) {
  let critLevel = findCritLvl(data.avg, data.threshold, data.threshold - data.threshold * 0.1);
  this.sensordb.update({ "id": idsensor, "values.sensortype": sensortype },
    { $set: { "values.$.avg": data.avg, "values.$.critLevel": critLevel } }, function (err, result) {
      if (err) {
        return console.log(err);
      }
      // console.log("Sensor Avg Update", result);
    })
};

Sensor.prototype.findSensoresInPlace = function (place, res) {
  var querySensor = [{
    $match: { location: place }
  }, {
    $unwind: '$values'
  }, {
    $project: { sensortype: '$values.sensortype' }
  }, {
    $group: {
      _id: null,
      sensortype: { $push: '$sensortype' }
    }
  }];
  this.sensordb.aggregate(querySensor, function (err, snr) {
    if (err) {
      return res.json({
        status: false,
        data: err.toString()
      });
    }
    console.log(snr);
    if (snr.length < 1) {
      return res.json({
        status: false,
        data: 'empty'
      })
    }
    return res.json({
      status: true,
      data: snr[0].sensortype
    });
  })
};

Sensor.prototype.findAllValuesSensorInPlace = function (place, sensor, res) {
  var query = [
    {
      $match: { location: place }
    }, {
      $unwind: '$values'
    }, {
      $unwind: '$values.value'
    }, {
      $match: { 'values.sensortype': sensor }
    }, {
      $sort: { 'values.value.time': 1 }
    }, {
      $project: {
        value: '$values.value.value',
        time: '$values.value.time'
      }
    }, {
      $group: {
        _id: null,
        value: { $push: '$value' },
        time: { $push: '$time' }
      }
    }];
  this.sensordb.aggregate(query, function (err, snrVals) {
    if (err) {
      return res.json({
        status: false,
        data: err.toString()
      });
    }
    return res.json({
      status: true,
      data: snrVals[0]
    });
  })
};

Sensor.prototype.findLastAvgFromSensor = function (sensortype, location, limit, res) {
  var self = this;
  var query = [{
    $match: { location: location }
  }, {
    $unwind: '$values'
  }, {
    $unwind: '$values.value'
  }, {
    $match: { 'values.sensortype': sensortype }
  }, {
    $sort: { 'values.value.time': -1 }
  }, {
    $limit: parseInt(limit)
  }, {
    $project: {
      value: '$values.value.value',
      threshold: '$values.threshold'
    }
  }, {
    $group: {
      _id: null,
      threshold: { $last: '$threshold' },
      value: { $push: '$value' },
      avg: { $avg: '$value' }
    }
  }];
  this.sensordb.aggregate(query, (err, snrVals) => {
    if (err) {
      return res.json({
        status: false,
        data: err.toString()
      });
    }
    return res.json({
      status: true,
      data: snrVals[0]
    });
  });
};

Sensor.prototype.getAllInfoSensoresAllPlaces = function (res) {
  this.sensordb.aggregate([
    {
      $unwind: '$values'
    }, {
      $project: {
        id: '$id',
        location: "$location",
        'sensortype': '$values.sensortype',
        'threshold': '$values.threshold',
        'avg': '$values.avg',
        'avgLastUpdate': "$values.avgLastUpdate",
        'critLevel': "$values.critLevel"
      }
    }], function (err, allInfoSensor) {
      if (err) {
        return res.json({
          status: false,
          data: err.toString()
        });
      }
      return res.json({
        status: true,
        data: allInfoSensor
      });
    });
}

Sensor.prototype.getAllCriticalSensorses = function (critLevel, res) {
  this.sensordb.aggregate([
    {
      $unwind: '$values'
    }, {
      $match: {
        'values.critLevel': parseInt(critLevel)
      }
    }, {
      $project: {
        id: '$id',
        location: '$location',
        'sensortype': '$values.sensortype',
        'threshold': '$values.threshold',
        'avg': '$values.avg',
        'avgLastUpdate': '$values.avgLastUpdate',
        'critLevel': "$values.critLevel"
      }
    }], function (err, allInfoSensor) {
      if (err) {
        return res.json({
          status: false,
          data: err.toString()
        });
      }
      console.log('allInfoSensor');
      console.log(allInfoSensor);
      return res.json({
        status: true,
        data: allInfoSensor
      });
    });
}

module.exports = Sensor;

Array.prototype.contains = function (sensortype) {
  var i = this.length;
  while (i--) if (sensortype === this[i].sensortype) return { index: i, contains: true };
  return { index: -1, contains: false };
}

var findCritLvl = function (avg, threshold_max, threshold_near_max, threshold_min, threshold_near_min) {
  if (avg >= threshold_max) {
    return 2;
  } else if (avg >= threshold_near_max) {
    return 1;
  } else if (avg < threshold_near_max) {
    return 0;
  } else {
    return -1;
  }
}
