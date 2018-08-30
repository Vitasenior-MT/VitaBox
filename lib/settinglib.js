'use strict'
var Setting = require('./models/settings.js'),
  Remote = require('./models/remotes.js'),
  remotelib = require('./remotelib.js');

Setting = new Setting();
Remote = new Remote();

module.exports = {
  saveSettings: function (req, res) {
    Setting.saveSettings(req.body, res);
  },
  getAppSettings: function (req, res) {
    Setting.getSettings(res);
  },
  postToken: function (req, res) {
    Setting.updateToken(req.body, res);
  },
  getToken: function (req, res) {
    Setting.getToken(res);
  },
  getData: function (req, res) {
    remotelib.getData(req, res);
  },
  getSettings: function (callback) {
    Remote.getSettings(callback);
  }
}
