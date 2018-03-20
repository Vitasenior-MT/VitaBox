'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var ValueSchema = new Schema({
  value: { type: Number, required: true },
  time: { type: Date, required: true }
}, { versionKey: false });

var ThresholdSchema = new Schema({
  min_acceptable: { type: Number, required: true },
  max_acceptable: { type: Number, required: true },
  min_possible: { type: Number, required: true },
  max_possible: { type: Number, required: true }
}, { versionKey: false });

var ValuesSchema = new Schema({
  sensortype: { type: String, required: true },
  threshold_flg: { type: Boolean, default: false },
  threshold: [ThresholdSchema],
  avg: { type: Number, default: 0 },
  avgLastUpdate: { type: Date, default: Date.now, required: true },
  critLevel: { type: Number, default: 0 },
  value: [ValueSchema]
}, { versionKey: false });

var SensorSchema = new Schema({
  id: { type: String, required: true },
  values: [ValuesSchema],
  node_id: { type: String, required: true },
  location: { type: String, required: true }
}, { versionKey: false });

var Sensor = function (skt) {
  this.sensordb = mongoose.model('Sensor', SensorSchema);
  this.sktSend = skt;
}

Sensor.prototype.insertOrUpdateSensor = function (data, res) {
  let sensors = [];
  for (var index in data) {
    sensors.push({
      id: data[index].id,
      node_id: data[index].node_id,
      location: data[index].location,
      values: []
    });
    let values = sensors[sensors.length - 1].values;
    let sensor = data[index].BoardModel.Sensors;
    let threshold_flg = data[index].BoardModel === 'environmental' ? true : false;
    for (var i in data[index].BoardModel.Sensors) {
      values.push({
        sensortype: sensor[i].tag,
        threshold_flg: threshold_flg,
        threshold: {
          min_acceptable: sensor[i].min_acceptable,
          max_acceptable: sensor[i].max_acceptable,
          min_possible: sensor[i].min_possible,
          max_possible: sensor[i].max_possible
        },
        value: []
      });
    }
  }
  var self = this;
  var query = { id: data.id },
    options = { upsert: true, new: true, setDefaultsOnInsert: true },
    update = {
      sensors
    };
  this.sensordb.findOneAndUpdate(query, { sensors }, options, (err, result) => {
    if (err) {
      return console.log('findOneAndUpdate error', err);
    }
    console.log(result);
  });
};

Sensor.prototype.addValues = function (data, res) {
  var self = this;
  var query = { id: data.id };
  this.sensordb.findOne(query, (err, result) => {
    if (err) {
      return console.log('findOneAndUpdate error', err);
    }
    console.log(result);
    /*result.values.push({
      sensortype: data.values[index].sensortype,
      threshold_flg: true,
      threshold: thres.threshold,
      value: data.values[index].value
    });
    result.save(function (err, sensor) {
      if (err) {
        return console.log('Sensor save error', err);
      }
      for (var index = 0; index < sensor.values.length; index++) {
        self.agragateSensorData(sensor.values[index].sensortype, sensor.id, sensor.location);
      }
    });
    return res.json({
      status: "success",
      data: "ok"
    });*/
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

Sensor.prototype.findSensorAllInfo = function (place, res) {
  var query = [
    {
      $match: { location: place }
    }, {
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
    }, {
      $group: {
        _id: null,
        sensor_location: {
          $push: {
            id: '$id',
            location: "$location",
            'sensortype': '$sensortype',
            'threshold': '$threshold',
            'avg': '$avg',
            'avgLastUpdate': "$avgLastUpdate",
            'critLevel': "$critLevel"
          }
        }
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
      return res.json({
        status: true,
        data: allInfoSensor
      });
    });
}

Sensor.prototype.getSensorData = function (res) {
  this.sensordb.aggregate([
    { $unwind: '$values' }, { $unwind: '$values.value' }, {
      $project: {
        _id: 0,
        board_id: '$id',
        sensor_id: "$values.sensortype",
        datetime: "$values.value.time",
        value: "$values.value.value"
      }
    }], function (err, allInfoSensor) {
      if (err) {
        return res.json({
          status: true,
          data: err
        });
      } else {
        return res.json({
          status: true,
          data: allInfoSensor
        });
      }
    });
}

Sensor.prototype.getSensorData2 = function (callback) {
  this.sensordb.aggregate([
    { $unwind: '$values' }, { $unwind: '$values.value' }, {
      $project: {
        _id: 0,
        board_id: '$id',
        sensor_id: "$values.sensortype",
        datetime: "$values.value.time",
        value: "$values.value.value"
      }
    }], function (err, allInfoSensor) {
      callback(err ? err : allInfoSensor);
    });
}

Sensor.prototype.getAllSensorsByLocation = function (res) {
  this.sensordb.find(
    {},
    {
      id: 1,
      location: 1,
      "values.sensortype": 1,
      "values.threshold": 1,
      "values.avg": 1,
      "values.avgLastUpdate": 1
    },
    function (err, allensorinplace) {
      if (err) {
        return res.json({
          status: false,
          data: err.toString()
        });
      }
      return res.json({
        status: true,
        data: allensorinplace
      });
    }
  );
};

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