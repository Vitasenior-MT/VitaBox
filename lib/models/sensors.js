'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * TODO: Definição da estrutura do trandutor
 */
var SensorSchema = new Schema({
  board_id: { type: String, required: true },
  sensor_id: { type: String, required: true },
  node_id: { type: String, required: true },
  sensortype: { type: String, required: true },
  location: { type: String, required: true },
  threshold_min_acceptable: { type: Number, required: false },
  threshold_max_acceptable: { type: Number, required: false },
  threshold_min_possible: { type: Number, required: false },
  threshold_max_possible: { type: Number, required: false },
  avg: { type: Number, default: 0 },
  avgLastUpdate: { type: Date, default: Date.now, required: true },
  critLevel: { type: Number, default: 0 }
}, { versionKey: false });

/**
 * TODO: Criação do sensor
 * @param {object} skt Socket de comunicação com a interface web
 */
var Sensor = function (skt) {
  this.sensordb = mongoose.model('Sensor', SensorSchema);
  this.sktSend = skt;
  this.sensorObj = [];
}

/**
 * TODO: Inserir dados na db so para testes
 * @param {} data
 */
Sensor.prototype.insertMany = function (data) {
  this.sensordb.insertMany(data, function (err, result) {
    //callback(data);
  });
};

Sensor.prototype.countDataSensor = function(callback) {
  this.sensordb.count(function(err, result){
    if (err) {
      return console.log("Error", err);
    }
    if (result <= 0) {
      callback();
    }
  });
}

/**
 * TODO: Criação dos sensores com a várias boards com os seus transdutores
 * @param {object} boards Lista com todas as bords
 */
Sensor.prototype.create = function (boards) {
  let self = this;
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  let sensors = null;
  for (let index = 0; index < boards.boards.length; index++) {
    let board = boards.boards[index];
    for (let i = 0; i < board.Boardmodel.Sensors.length; i++) {
      sensors = {
        board_id: board.id,
        node_id: board.node_id,
        location: board.location,
        sensor_id: board.Boardmodel.Sensors[i].id,
        sensortype: board.Boardmodel.Sensors[i].tag,
        threshold_min_acceptable: board.Boardmodel.Sensors[i].min_acceptable,
        threshold_max_acceptable: board.Boardmodel.Sensors[i].max_acceptable,
        threshold_min_possible: board.Boardmodel.Sensors[i].min_possible,
        threshold_max_possible: board.Boardmodel.Sensors[i].max_possible
      };
      this.sensordb.findOneAndUpdate({ board_id: sensors.board_id, sensor_id: sensors.sensor_id }, sensors, options, (err, result) => {
        self.sensorObj.push(result);
      });
    }
  }
};

/**
 * TODO: Atualização 
 * @param {object} data 
 * @param {object} res Resposta ao request
 */
Sensor.prototype.update = function (data, res) {
  var self = this;
  data.sensorData.critLevel = findCritLvl(data.sensorData.avg, data.sensorData.threshold_max_possible, data.sensorData.threshold_max_acceptable);
  data.sensorData.avgLastUpdate = Date.now();
  this.sensordb.update({ 'board_id': data.data.board_id, "sensor_id": data.data.sensor_id },
    {
      $set: {
        "avg": data.sensorData.avg,
        "avgLastUpdate": data.sensorData.avgLastUpdate,
        "critLevel": data.sensorData.critLevel
      }
    }, (err, result) => {
      self.sktSend.sendMsgToPage("avgSensorUpdate", {
        id: data.data.board_id,
        sensortype: data.sensorData.sensortype,
        location: data.sensorData.location,
        threshold: data.sensorData.threshold_max_possible,
        avg: data.sensorData.avg,
        avgLastUpdate: data.sensorData.avgLastUpdate,
        critLevel: data.sensorData.critLevel
      });
      if (data.sensorData.threshold_max_possible < data.sensorData.avg) {
        self.sktSend.sendSensorAlert({
          warning_type: data.sensorData.sensortype,
          location: data.sensorData.location,
          threshold: data.sensorData.threshold_max_possible,
          avg: data.sensorData.avg,
          avgLastUpdate: data.sensorData.avgLastUpdate
        });
      }
    });
};

/**
 * TODO: getSensors
 * @param {function} callback
 */
Sensor.prototype.getSensors = function (callback) {
  if (this.sensorObj.length > 0) {
    callback(buildObject(this.sensorObj));
  } else {
    this.sensordb.find({}, (err, result) => {
      this.sensorObj = buildObject(result);
      callback(this.sensorObj);
    });
  }
};

/**
 * TODO: 
 * @param {function} callback
 */
Sensor.prototype.getAllSensorsInfo = function (callback) {
  this.sensordb.find({}, (err, result) => {
    sendData(callback, err, result);
  });
};

/**
 * TODO: 
 * @param {number} critLevel
 * @param {object} res
 */
Sensor.prototype.getAllCriticalSensors = function (critLevel, res) {
  this.sensordb.aggregate([{
    $match: {
      'critLevel': parseInt(critLevel)
    }
  }, {
    $project: {
      node_id: '$node_id',
      location: '$location',
      'sensortype': '$sensortype',
      'threshold_max_possible': '$threshold_max_possible',
      'avg': '$avg',
      'avgLastUpdate': '$avgLastUpdate',
      'critLevel': "$critLevel"
    }
  }], function (err, result) {
    sendData(res, err, result);
  });
}

/**
 * TODO: 
 * @param {object} res
 */
Sensor.prototype.getAllSensorsByLocation = function (res) {
  this.sensordb.find({},
    {
      board_id: 1,
      sensor_id: 1,
      location: 1,
      "sensortype": 1,
      "threshold_max_possible": 1,
      "avg": 1,
      "avgLastUpdate": 1
    },
    function (err, result) {
      sendData(res, err, result);
    }
  );
};

/**
 * TODO: 
 * @param {object} res
 */
Sensor.prototype.getSensorsByLocation = function (res) {
  this.sensordb.aggregate([
    {
      $group: {
        _id: '$location',
        values: {
          $push: {
            board_id: '$board_id',
            sensor_id: '$sensor_id',
            sensortype: '$sensortype',
            threshold_max_possible: '$threshold_max_possible',
            avg: '$avg',
            avgLastUpdate: '$avgLastUpdate'
          }
        }
      }
    }], function (err, result) {
      sendData(res, err, result);
    });
};

/**
 * TODO: 
 * @param {ibject} res
 */
Sensor.prototype.getListOfLocations = function (res) {
  this.sensordb.distinct('location', function (err, result) {
    sendData(res, err, result);
  });
};

/**
 * TODO: 
 * @param {object} res
 */
Sensor.prototype.getListOfSensors = function (res) {
  this.sensordb.distinct('sensortype', function (err, result) {
    sendData(res, err, result);
  });
};

/**
 * TODO: 
 * @param {object} res
 */
Sensor.prototype.getListOfSensorsID = function (res) {
  this.sensordb.distinct('sensor_id', function (err, result) {
    sendData(res, err, result);
  });
};

/**
 * TODO: 
 * @param {object} res
 */
Sensor.prototype.getListOfBoardsID = function (res) {
  this.sensordb.distinct('board_id', function (err, result) {
    sendData(res, err, result);
  });
};

module.exports = Sensor;

/**
 * TODO: 
 * @param {number} avg
 * @param {number} max_possible
 * @param {number} max_acceptable
 */
var findCritLvl = function (avg, max_possible, max_acceptable) {
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

var buildObject = function (obj) {
  var sensors = [];
  for (var index = 0; index < obj.length; index++) {
    if (!sensors[obj[index].node_id]) {
      sensors[obj[index].node_id] = {
        board_id: obj[index].board_id,
        sensorID: []
      };
    }

    if (!sensors[obj[index].node_id].sensorID[obj[index].sensortype]) {
      sensors[obj[index].node_id].sensorID[obj[index].sensortype] = {
        sensor_id: obj[index].sensor_id,
        location: obj[index].location,
        sensortype: obj[index].sensortype,
        threshold_min_acceptable: obj[index].threshold_min_acceptable,
        threshold_max_acceptable: obj[index].threshold_max_acceptable,
        threshold_min_possible: obj[index].threshold_min_possible,
        threshold_max_possible: obj[index].threshold_max_possible,
        avg: obj[index].avg,
        critLevel: obj[index].critLevel,
        avgLastUpdate: obj[index].avgLastUpdate
      };
    }

  }
  return sensors;
}