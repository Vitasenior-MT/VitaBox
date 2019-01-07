'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NotificationsmodelSchema = new Schema({
  message: { type: String, required: true },
  from: { type: String, required: false },
  to: { type: String, required: true },
  flg_read: { type: Boolean, default: false },
}, { _id: false, versionKey: false });

var NotificationTable = function () {
  this.notificationdb = mongoose.model('NotificationTable', NotificationsmodelSchema);
};

NotificationTable.prototype.insert = function (data) {
  this.notificationdb.insertMany(data, function (err, result) {
    if (err) {
      return console.log("error", err);
    }
  });
};

NotificationTable.prototype.get = function (callback) {
  this.notificationdb.find({}, (err, result) => {
    if (err) {
      return console.log("Error", err);
    }
    if (result.length > 0) {
      callback(result);
    } else {
      callback(false);
    }
  });
};

module.exports = NotificationTable;
