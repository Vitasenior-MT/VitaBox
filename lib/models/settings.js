'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var SettingSchema = new Schema({
  waiting_time: { type: Number, required: true },
  token: { type: String }
}, { versionKey: false });

var Setting = function () {
  this.settingdb = mongoose.model('Setting', SettingSchema);
};

Setting.prototype.insertSetting = function (waiting_time) {
  this.settingdb.create({
    waiting_time: waiting_time
  }, (err, setting) => {
    if (err) {
      return console.log(err);
    }
    console.log(setting);
  });
}

Setting.prototype.updateToken = function (token) {
  this.settingdb.update({ "token": token },
    { $set: { "token": token } }, function (err, result) {
      if (err) {
        return console.log(err);
      }
    });
}

Setting.prototype.getToken = function () {
  var self = this;
  var query = { token: token };
  this.settingdb.find(query, (err, res) => {
    if (err) {
      return console.log('findOneAndUpdate error', err);
    }

    return res.json({
      status: "success",
      data: "ok"
    });
  });
}


module.exports = Setting;
