'use strict'
var mongoose = require('mongoose'),
  logger = require('./../logger'),
  errorLog = logger.errorlog,
  successlog = logger.successlog,
  Schema = mongoose.Schema;

var SettingSchema = new Schema({
  id: { type: Number, required: true },
  waiting_time: { type: Number, required: true },
  token: { type: String, default: 0, required: true },
  app_settings: { type: String, required: true },
  ssid: { type: String, default: '', required: true },
  psswd: { type: String, default: '', required: true },
  district: { type: String },
  locality: { type: String },
  flg_bandfitness: { type: Boolean, default: false },
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

Setting.prototype.saveSettings = function (settings, res) {
  var query = { id: 1 },
    options = { upsert: true, new: true, setDefaultsOnInsert: true },
    update = {
      id: 1,
      app_settings: settings
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

Setting.prototype.saveWifiSettings = function (settings, res) {
  var query = { id: 1 },
    options = { upsert: true, new: true, setDefaultsOnInsert: true },
    update = {
      id: 1,
      ssid: settings.ssid,
      psswd: settings.psswd,
      auto: settings.auto
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

Setting.prototype.getWifiSettings = function (callback) {
  this.settingdb.findOne({ id: 1 }, (err, result) => {
    callback(err, result);
  });
}

Setting.prototype.getSettings = function (res) {
  this.settingdb.findOne({ id: 1 }, (err, result) => {
    sendData(res, err, result);
  });
}

Setting.prototype.updateToken = function (data, res) {
  var query = { id: 1 },
    options = { upsert: true, new: true, setDefaultsOnInsert: true },
    update = {
      id: 1,
      token: data.token,
      district: data.district,
      locality: data.locality
    };
  process.env.token = data.token;
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

Setting.prototype.getLocationDistrict = function (res) {
  var query = [{
    $match: { id: 1 }
  },
  {
    $project: {
      _id: 0,
      district: 1,
      locality: 1
    }
  }];
  this.settingdb.aggregate(query, (err, result) => {
    sendData(res, err, result);
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

Setting.prototype.updateFlagBandFit = function (flag, res) {
  console.log(flag);
  var query = { id: 1 },
    options = { upsert: true, new: true, setDefaultsOnInsert: true },
    update = {
      id: 1,
      flg_bandfitness: flag
    };
  this.settingdb.findOneAndUpdate(query, update, options, (err, result) => {
    sendData(res, err, 'flg_bandfitness: ' + result.flg_bandfitness);
  });
}

Setting.prototype.getFlagBandFit = function (res) {
  this.settingdb.find({}, {
    _id: 0,
    flg_bandfitness: 1,
  }, function (err, result) {
    sendData(res, err, result);
  });
}

module.exports = Setting;

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