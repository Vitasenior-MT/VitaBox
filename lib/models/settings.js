'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SettingSchema = new Schema({
  id: { type: Number, required: true },
  waiting_time: { type: Number, required: true },
  token: { type: String, default: 0, required: true }
}, { _id: false, versionKey: false });

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

Setting.prototype.updateToken = function (token, res) {
  var waiting_time = 1;
  var query = { id: 1 },
    options = { upsert: true, new: true, setDefaultsOnInsert: true },
    update = {
      id: 1,
      waiting_time: waiting_time,
      token: token
    };
  this.settingdb.findOneAndUpdate(query, update, options, (err, result) => {
    err ? res({
      status: false,
      data: err
    })
      : res({
        status: true,
        data: result
      });
  });
}

Setting.prototype.getToken = function (res) {
  var query = [{
    $match: { id: 1 }
  },
  {
    $project: {
      _id: 0,
      token: 1
    }
  }];
  this.settingdb.aggregate(query, (err, result) => {
    if (typeof res === 'function') {
      if (err) {
        res({
          status: false,
          data: err
        });
      } else {
        res({
          status: true,
          data: result
        });
      }
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
  });
}

module.exports = Setting;
