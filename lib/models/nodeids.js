'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var NodeIdSchema = new Schema({
  nodeid: { type: String, required: true }
}, { _id: false, versionKey: false });

var NodeId = function () {
  this.nodeiddb = mongoose.model('NodeId', NodeIdSchema);
};

NodeId.prototype.countRemoteCmd = function (callback) {
  this.nodeiddb.count(function (err, remote) {
    if (err) {
      return console.log("Error", err);
    }
    if (remote <= 0) {
      callback();
    }
  });
};

NodeId.prototype.insert = function (params) {
  this.nodeiddb.insertMany(params, function (err, result) {
    if (err) {
      return console.log(err);
    }
    console.log('insert inserted!' /*, result*/);
  });
};

NodeId.prototype.getAll = function (nodeid, callback) {
  var query = [{
    $match: { nodeid: { $regex: '[[:<:]]' + nodeid + '[[:>:]]' } }
  },
  {
    $project: {
      _id: 0,
      nodeid: 1
    }
  }];
  this.nodeiddb.aggregate(query, (err, result) => {
    console.log(result);
    err ? callback(err, null) : callback(null, result);
  });
}

module.exports = NodeId;
