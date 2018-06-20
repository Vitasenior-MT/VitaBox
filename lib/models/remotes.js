'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RemoteSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  task: { type: String, required: true },
  timed_flg: { type: Boolean, default: false }
}, { versionKey: false });

var Remote = function () {
  this.remotedb = mongoose.model('Remote', RemoteSchema);
};

Remote.prototype.insertMany = function (data) {
  this.remotedb.deleteMany({}, () => {
    this.remotedb.insertMany(data, function (err, result) {
      if (err) {
        return console.log("error", err);
      }
      console.log("Sensor many OK");
    });
  });
};

Remote.prototype.getKey = function (code, callback) {
  this.remotedb.findOne({ code: code }, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

Remote.prototype.getData = function (res) {
  var query = [
    {
      $project: {
        _id: 0,
        name: 1,
        code: 1,
        task: 1,
        timed_flg: 1
      }
    }];
  this.remotedb.aggregate(query, (err, result) => {
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
  });
}

Remote.prototype.getSettings = function (callback) {
  var query = [
    {
      $project: {
        _id: 0,
        name: 1,
        code: 1,
        task: 1,
        timed_flg: 1
      }
    }];
  this.remotedb.aggregate(query, (err, result) => {
    err ? callback(err, null) : callback(null, result)
  });
}

module.exports = Remote;
