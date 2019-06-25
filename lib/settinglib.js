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
  saveWifiSettings: function (req, res) {
    Setting.saveWifiSettings(req.body, res);
  },
  getAppSettings: function (req, res) {
    Setting.getSettings(res);
  },
  postToken: function (req, res) {
    Setting.updateToken(req.data, res);
  },
  getToken: function (req, res) {
    Setting.getToken(res);
  },
  getLocationDistrict: function (req, res) {
    Setting.getLocationDistrict(res);
  },
  getData: function (req, res) {
    remotelib.getData(req, res);
  },
  getSettings: function (callback) {
    Remote.getSettings(callback);
  },
  getWifiSettings: function (callback) {
    Setting.getWifiSettings(callback);
  },
  getFlgScreen: function (req, res) {
    Setting.getFlgScreen(res); 
  },
  updateFlgScreen: function(data, res){
    console.log('here???????????????????', data)
    Setting.updateFlgScreen(data.flg, res);
  },
}
