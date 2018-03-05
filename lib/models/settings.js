'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var SettingSchema = new Schema({
  waiting_time: { type: Number, required: true }
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


module.exports = Setting;
