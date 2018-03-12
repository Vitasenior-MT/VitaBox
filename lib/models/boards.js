'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var BoardSensorsSchema = new Schema({
  id: { type: String, required: true },
  transducer: { type: String, required: true },
  measure: { type: String, required: true  },
  min_acceptable: { type: Number, required: true  },
  max_acceptable: { type: Number, required: true  },
  min_possible: { type: Number, required: true  },
  max_possible: { type: Number, required: true  }
});

var BoardModelSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  sensors: [BoardSensorsSchema]
});

var BoardSchema = new Schema({
  id: { type: String, required: true },
  location: { type: String, required: true },
  mac_address: { type: String, required: true  },
  created_at: { type: Date, required: true  },
  boardModel: [BoardModelSchema]
});

var Board = function () {
  this.thresholddb = mongoose.model('Board', BoardSchema);
};

module.exports = Board;
