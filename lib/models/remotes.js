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

module.exports = Remote;
