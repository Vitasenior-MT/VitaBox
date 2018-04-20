'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * TODO: Definição da estrutura dos valores do trandutor
 */
var ValueSchema = new Schema({
  value: { type: Number, required: true },
  time: { type: Date, required: true },
  flg_available: { type: Boolean, default: true },
}, { versionKey: false });

/**
 * TODO: Definição da estrutura do trandutor
 */
var ValuesSchema = new Schema({
  sensortype: { type: String, required: true },
  threshold_flg: { type: Boolean, default: false },
  threshold: {
    min_acceptable: { type: Number, required: false },
    max_acceptable: { type: Number, required: false },
    min_possible: { type: Number, required: false },
    max_possible: { type: Number, required: false }
  },
  avg: { type: Number, default: 0 },
  avgLastUpdate: { type: Date, default: Date.now, required: true },
  critLevel: { type: Number, default: 0 },
  value: [ValueSchema]
}, { versionKey: false });

/**
 * TODO: Definição da estrutura do sensor
 */
var SensorSchema = new Schema({
  id: { type: String, required: true },
  values: [ValuesSchema],
  node_id: { type: String, required: true },
  location: { type: String, required: true }
}, { versionKey: false });

/**
 * TODO: Criação do sensor
 * @param {Socket de comunicação com a intervade web} skt 
 */
var Sensor = function (skt) {
  this.sensordb = mongoose.model('Sensor', SensorSchema);
  this.sktSend = skt;
}

Sensor.prototype.insertOrUpdateSensor = function (boards) {
  this.boardVerify(boards.boards);
};

Sensor.prototype.boardVerify = function (boards) {
  var self = this;
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  let sensors = null;
  for (var index = 0; index < boards.length; index++) {
    sensors = {
      id: boards[index].id,
      node_id: boards[index].node_id,
      location: boards[index].location
    };
    let board = boards[index];
    self.sensordb.findOneAndUpdate({ id: sensors.id }, sensors, options, (err, result) => {
      self.sensorVerify(result.id, board);
    });
  }
}

Sensor.prototype.sensorVerify = function (id, board) {
  let boardmodel = board.Boardmodel;
  this.sensordb.findOne({ id: id }, (err, result) => {
    if (boardmodel.Sensors.length > 0) {
      let sensor = boardmodel.Sensors;
      for (var i = 0; i < sensor.length; i++) {
        if (!result.values.verify(result.id, sensor[i].tag, board.id)) {
          result.values.push({
            sensortype: sensor[i].tag,
            threshold_flg: boardmodel === 'environmental' ? true : false,
            threshold: {
              min_acceptable: sensor[i].min_acceptable,
              max_acceptable: sensor[i].max_acceptable,
              min_possible: sensor[i].min_possible,
              max_possible: sensor[i].max_possible
            }
          });
        }
        if (i === sensor.length - 1) {
          result.save(function (err, sensor) {
            if (err) {
              return console.log('Sensor save error', err);
            }
          });
        }
      }
    }
  });
}

Array.prototype.verify = function (sensorId, sensortype, boardId) {
  var i = this.length;
  while (i--) {
    if(sensortype === this[i].sensortype && boardId === sensorId){
      return true;
    }
    if (i === 0) {
      return false;
    }
  }
  return false;
}

Sensor.prototype.addValues = function (data, res) {
  var self = this;
  var query = { node_id: data.node_id };
  this.sensordb.findOne(query, (err, result) => {
    if (err) {
      return console.log('findOneAndUpdate error', err);
    }
    for (var i = 0; i < result.values.length; i++) {
      for (var j = 0; j < data.values.length; j++) {
        if (result.values[i].sensortype === data.values[j].sensortype) {
          result.values[i].value.push(data.values[j].value);
          result.values[i].avgLastUpdate = Date.now();
          result.values[i].critLevel = findCritLvl(result.values[i].avg, result.values[i].threshold.max_possible, result.values[i].threshold.max_acceptable);
          self.getAvg({
            id: result.id,
            node_id: data.node_id,
            sensortype: result.values[i].sensortype,
            threshold: result.values[i].threshold.max_possible,
            location: result.location,
            avgLastUpdate: result.values[i].avgLastUpdate,
            critLevel: result.values[i].critLevel
          });
        }
      }
    }
    result.save(function (err, sensor) {
      if (err) {
        return console.log('Sensor save error', err);
      }
    });
    return res.json({
      status: "success",
      data: "ok"
    });
  });
};

Sensor.prototype.getAvg = function (data) {
  var self = this;
  var query = [{
    $match: { node_id: data.node_id }
  }, {
    $unwind: '$values'
  }, {
    $unwind: '$values.value'
  }, {
    $match: { 'values.sensortype': data.sensortype }
  }, {
    $sort: { 'values.value.time': -1 }
  }, {
    $limit: 10
  }, {
    $project: {
      value: '$values.value.value'
    }
  }, {
    $group: {
      _id: null,
      value: { $push: '$value' },
      avg: { $avg: '$value' }
    }
  }];
  this.sensordb.aggregate(query, (err, result) => {
    if (err) {
      return console.log('Sensor agregate error ', err);
    }
    let avg = result.length < 1 ? 0 : result[0].avg;
    this.sensordb.update({ 'node_id': data.node_id, "values.sensortype": data.sensortype },
      { $set: { "values.$.avg": avg } }, (err, result) => { });
    self.sktSend.sendMsgToPage("avgSensorUpdate", {
      id: data.id,
      sensortype: data.sensortype,
      location: data.location,
      threshold: data.threshold,
      avg: avg,
      avgLastUpdate: data.avgLastUpdate,
      critLevel: data.critLevel
    });
    if (result[0] && result[0].value.length > 9) {
      if (data.threshold < avg) {
        self.sktSend.sendSensorAlert({
          warning_type: data.sensortype,
          location: data.location,
          threshold: data.threshold,
          avg: avg,
          avgLastUpdate: data.avgLastUpdate
        });
      } else {
        console.log("Not Send MSG.");
      }
    }
  });
};

Sensor.prototype.getAllCriticalSensors = function (critLevel, res) {
  this.sensordb.aggregate([
    {
      $unwind: '$values'
    }, {
      $match: {
        'values.critLevel': parseInt(critLevel)
      }
    }, {
      $project: {
        node_id: '$node_id',
        location: '$location',
        'sensortype': '$values.sensortype',
        'threshold': '$values.threshold.max_possible',
        'avg': '$values.avg',
        'avgLastUpdate': '$values.avgLastUpdate',
        'critLevel': "$values.critLevel"
      }
    }], function (err, result) {
      sendData(res, err, result);
    });
}

/**
 * TODO: Metodo que desolve um array, cada posição encontra-se cada trandutor 
 * bem como toada a informação relevante ao mesmo 
 * @param {resposta ao ajaz request} res 
 */
Sensor.prototype.getAllSensorsByLocation = function (res) {
  this.sensordb.find({},
    {
      id: 1,
      location: 1,
      "values.sensortype": 1,
      "values.threshold": 1,
      "values.avg": 1,
      "values.avgLastUpdate": 1
    },
    function (err, result) {
      sendData(res, err, result);
    }
  );
};

Sensor.prototype.getSensorsByLocation = function (res) {
  this.sensordb.aggregate([
    {
      $unwind: '$values'
    }, {
      $group: {
        _id: '$location',
        values: {
          $push: {
            id: '$id',
            sensortype: '$values.sensortype',
            threshold: '$values.threshold.max_possible',
            avg: '$values.avg',
            avgLastUpdate: '$values.avgLastUpdate'
          }
        }
      }
    }], function (err, result) {
      sendData(res, err, result);
    });
};

Sensor.prototype.getAllInfoSensorsAllPlaces = function (res) {
  this.sensordb.aggregate([
    {
      $unwind: '$values'
    }, {
      $project: {
        id: '$id',
        location: "$location",
        'sensortype': '$values.sensortype',
        'threshold': '$values.threshold.max_possible',
        'avg': '$values.avg',
        'avgLastUpdate': "$values.avgLastUpdate",
        'critLevel': "$values.critLevel"
      }
    }], function (err, result) {
      sendData(res, err, result);
    });
};

Sensor.prototype.getSensorData = function (res) {
  var query = [{
    $unwind: '$values'
  }, {
    $unwind: '$values.value'
  }, {
    $match: {
      'values.value.flg_available': true
    }
  }, {
    $sort: { 'values.value.time': 1 }
  }, {
    $limit: 10
  }, {
    $project: {
      _id: 0,
      board_id: '$id',
      sensor_id: "$values.sensortype",
      datetime: "$values.value.time",
      value: "$values.value.value",
      _id: "$values.value._id"
    }
  }];
  this.sensordb.aggregate(query, function (err, result) {
    /*this.sensordb.update({ 'node_id': data.node_id, "values.sensortype": data.sensortype },
      { $set: { "values.$.value.$.flg_available": false } }, (err, result) => { });*/
    console.log(result);
    sendData(res, err, result);
  });
};

Sensor.prototype.getByNodeId = function (node_id, callback) {
  var query = [{
    $match: { node_id: { $regex: '[[:<:]]' + node_id + '[[:>:]]' } }
  }, {
    $project: {
      _id: 0,
      id: 1,
      node_id: 1,
    }
  }];
  this.sensordb.aggregate(query, (err, result) => {
    err ? callback(err, null) : callback(null, result.length < 1 ? false : true);
  });
}

/**
 * TODO: Metodo que devolve as localizações dos sensores
 * @param {*} res 
 */
Sensor.prototype.getPlaceSensores = function (res) {
  this.sensordb.find({}, { location: 1 }, { sort: { location: 1 } }, function (err, result) {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    return res.json({
      status: true,
      data: result
    });
  });
}

/**
 * TODO: Metodo que devolve os valores armazenados do sensor
 * @param {Localização do sensor} place 
 * @param {Sensor} sensor 
 * @param {Rresposata ao ajax request} res 
 */
Sensor.prototype.getAllDataFromSensor = function (place, sensor, res) {
  var query = ''
  var queryopt = null
  if (sensor !== 'all') {
    query = { $and: [{ location: place }, { "values.sensortype": sensor }] }
    queryopt = { "values.$": 1 }
  } else {
    query = { location: place }
  }
  this.sensordb.find(query, queryopt, function (err, result) {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    return res.json({
      status: true,
      data: result
    });
  });
}

module.exports = Sensor;

var findCritLvl = function (avg, max_possible, max_acceptable, min_possible, min_acceptable) {
  if (avg >= max_possible) {
    return 2;
  } else if (avg >= max_acceptable) {
    return 1;
  } else if (avg < max_acceptable) {
    return 0;
  } else {
    return -1;
  }
}

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