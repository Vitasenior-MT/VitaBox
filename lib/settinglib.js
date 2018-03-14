'use strict'
var Setting = require('./models/settings.js'),
  Remote = require('./models/remotes.js'),
  remotelib = require('./remotelib.js');

Setting = new Setting();
Remote = new Remote();

module.exports = {
  postToken: function (req, res) {
    Setting.updateToken(req.body, res);
  },
  getToken: function (req, res) {
    Setting.getToken(res);
  },
  getToken2: function (callback) {
    Setting.getToken2(callback);
  },
  getData: function (req, res) {
    remotelib.getData(req, res);
  },
  getSettings: function (callback) {
    Remote.getSettings(callback);
  }
}
