'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * TODO: Definição da estrutura do trandutor
 */
var SensorSchema = new Schema({
  board_id: { type: String, required: true }, // board
  sensor_id: { type: String, required: true }, // transdutor
  node_id: { type: String, required: true }, // mote para a rede de sensores
  sensortype: { type: String, required: true },
  location: { type: String, required: true },
  measure: { type: String, required: true },
  unit: { type: String, required: true },
  to_read: { type: String, required: true },
  threshold_min_acceptable: { type: Number, required: false },
  threshold_max_acceptable: { type: Number, required: false },
  threshold_min_possible: { type: Number, required: false },
  threshold_max_possible: { type: Number, required: false },
  avg: { type: Number, default: 0 },
  avgLastUpdate: { type: Date, default: Date.now, required: true },
  critState: { type: Boolean, default: false }
}, { versionKey: false });

/**
 * TODO: Criação do sensor
 */
var Sensor = function () {
  this.sensordb = mongoose.model('Sensor', SensorSchema);
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

Sensor.prototype.countDataSensor = function (callback) {
  this.sensordb.count(function (err, result) {
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
 * @param { object } boards Lista com todas as bords
 */
Sensor.prototype.create = function (boards, callback) {
  let self = this;
  this.sensordb.deleteMany({}, () => {
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    let sensors = null;
    for (let index = 0; index < boards.boards.length; index++) {
      let board = boards.boards[index];
      for (let i = 0; i < board.Sensors.length; i++) {
        if (board.Boardmodel.type === "environmental") {
          sensors = {
            board_id: board.id,
            node_id: board.node_id,
            location: board.description,
            sensor_id: board.Sensors[i].id,
            measure: board.Sensors[i].Sensormodel.measure,
            unit: board.Sensors[i].Sensormodel.unit,
            to_read: board.Sensors[i].Sensormodel.to_read,
            sensortype: board.Sensors[i].Sensormodel.tag,
            threshold_min_acceptable: board.Sensors[i].Sensormodel.min_acceptable,
            threshold_max_acceptable: board.Sensors[i].Sensormodel.max_acceptable,
            threshold_min_possible: board.Sensors[i].Sensormodel.min_possible,
            threshold_max_possible: board.Sensors[i].Sensormodel.max_possible
          };
          this.sensordb.findOneAndUpdate({ board_id: sensors.board_id, sensor_id: sensors.sensor_id }, sensors, options, (err, result) => {
            if (err) {
              return console.log("Error", err);
            }
            self.sensorObj.push(result);
          });
        }
        if (boards.boards.length - 1 === index && board.Sensors.length - 1 === i) {
          callback(true);
        }
      }
    }
  });
};

/**
 * TODO: Atualização 
 * @param {object} data 
 * @param {object} res Resposta ao request
 */
Sensor.prototype.update = function (warning, data, functions, callback) {
  data.avgLastUpdate = Date.now();
  this.sensordb.update({ 'board_id': data.board_id, "sensor_id": data.sensor_id },
    {
      $set: {
        "avg": data.avg,
        "avgLastUpdate": data.avgLastUpdate,
        "critState": data.critState
      }
    }, (err, result) => {
      if (warning) {
        functions.sendSensorAlert({
          id: data.board_id,
          warning_type: data.sensortype,
          location: data.location,
          threshold_max_possible: data.threshold_max_possible,
          avg: data.avg,
          avgLastUpdate: data.avgLastUpdate
        });
      } else {
        functions.sendMsgToPage("sensorUpdate", {
          id: data.board_id,
          sensortype: data.sensortype,
          location: data.location,
          threshold_max_possible: data.threshold_max_possible,
          avg: data.avg,
          avgLastUpdate: data.avgLastUpdate
        });
      }
      callback();
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
 * @param { Id of the board } node_id
 * @param { Is invoked after the query } callback
 */
Sensor.prototype.getByNodeId = function (node_id, callback) {
  this.sensordb.findOne({ node_id: node_id }, (err, result) => {
    if (err) {
      return console.log("Error", err);
    }
    if (result.length > 0) {
      callback(true);

    } else {
      callback(false);
    }
  });
};

/**
 * TODO: 
 * @param { Is invoked after the query } callback
 */
Sensor.prototype.getAllSensorsInfo = function (callback) {
  this.sensordb.find({}, (err, result) => {
    sendData(callback, err, result);
  });
};

/**
 * TODO:
 * @param {object} res
 */
Sensor.prototype.getAllCriticalSensors = function (res) {
  this.sensordb.aggregate([{
    $match: {
      'critState': true
    }
  }, {
    $project: {
      'node_id': '$node_id',
      'location': '$location',
      'board_id': '$board_id',
      'measure': '$measure',
      'unit': '$unit',
      'to_read': '$to_read',
      'sensortype': '$sensortype',
      'threshold_max_acceptable': '$threshold_max_acceptable',
      'threshold_max_possible': '$threshold_max_possible',
      'threshold_min_acceptable': '$threshold_min_acceptable',
      'threshold_min_possible': '$threshold_min_possible',
      'avg': '$avg',
      'avgLastUpdate': '$avgLastUpdate'
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
      "avgLastUpdate": 1,
      measure: 1,
      unit: 1,
      to_read: 1
    },
    function (err, result) {
      sendData(res, err, result);
    }
  );
};

/**
 * TODO: 
 * @param { Is invoked after the query } res
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
            avgLastUpdate: '$avgLastUpdate',
            measure: '$measure',
            unit: '$unit',
            to_read: '$to_read'
          }
        }
      }
    }], function (err, result) {
      sendData(res, err, result);
    });
};

/**
 * TODO: Lists all the distinct locations of the table  returning all the locations names
 * @param { Is invoked after the query } res
 */
Sensor.prototype.getListOfLocations = function (res) {
  this.sensordb.distinct('location', function (err, result) {
    sendData(res, err, result);
  });
};

/**
 * TODO: Lists all the distinct sensors of the table returning all the sensors tag name
 * @param { Is invoked after the query } res
 */
Sensor.prototype.getListOfSensors = function (res) {
  this.sensordb.distinct('sensortype', function (err, result) {
    sendData(res, err, result);
  });
};

/**
 * TODO: Lists all the distinct sensors of the table returning all the sensors id
 * @param { Is invoked after the query } res
 */
Sensor.prototype.getListOfSensorsID = function (res) {
  this.sensordb.distinct('sensor_id', function (err, result) {
    sendData(res, err, result);
  });
};

/**
 * TODO: Lists all the distinct boards of the table returning all the boards id
 * @param { Is invoked after the query } res
 */
Sensor.prototype.getListOfBoardsID = function (res) {
  this.sensordb.distinct('board_id', function (err, result) {
    sendData(res, err, result);
  });
};

/**
 * TODO: Lists all the distinct boards of the table returning all the boards id
 * @param { Is invoked after the query } res
 */
Sensor.prototype.getByNodeId = function (node_id, callback) {
  this.sensordb.distinct('node_id', function (err, result) {
    if (err) {
      return console.log("Error", err);
    }
    result ? callback(true) : callback(false);
  });
};

/**
 * TODO: Lists all the distinct node ids of the table
 * @param { Is invoked after the query } callback
 */
Sensor.prototype.getNodeIdList = function (callback) {
  var self = this;
  this.sensordb.distinct('node_id', function (err, result) {
    if (err) {
      return console.log("Error", err);
    }
    callback(result);
  });
};

/**
 * TODO: Lists all the distinct sensortype of the table
 * @param { Is invoked after the query } res
 */
Sensor.prototype.getSensortypeList = function (res) {
  this.sensordb.distinct('sensortype', function (err, result) {
    sendData(res, err, result);
  });
};

Sensor.prototype.getDistictAllSensors = function (res) {
  var query = [{
    $group: {
      _id: null,
      sensors: {
        $addToSet: {
          sensortype: '$sensortype',
          measure: '$measure',
          unit: '$unit',
          to_read: '$to_read'
        }
      }
    }
  }];
  this.sensordb.aggregate(query, function (err, result) {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    res.json({
      status: true,
      data: result[0] ? result[0].sensors : null
    });
  });
}

module.exports = Sensor;

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

/**
 * TODO: Builds an object with the sensors info for fast access
 * @param { Raw sensor data } obj
 */
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
        board_id: obj[index].board_id,
        sensor_id: obj[index].sensor_id,
        location: obj[index].location,
        measure: obj[index].measure,
        unit: obj[index].unit,
        to_read: obj[index].to_read,
        sensortype: obj[index].sensortype,
        threshold_min_acceptable: obj[index].threshold_min_acceptable,
        threshold_max_acceptable: obj[index].threshold_max_acceptable,
        threshold_min_possible: obj[index].threshold_min_possible,
        threshold_max_possible: obj[index].threshold_max_possible,
        avg: obj[index].avg,
        critState: obj[index].critState,
        avgLastUpdate: obj[index].avgLastUpdate
      };
    }

  }
  return sensors;
}