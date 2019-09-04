'use strict'
var Remote = require('./models/remotes');

Remote = new Remote();

module.exports = {
  getKey : function(code, callback) {
   Remote.getKey(code, callback);
  },
  getData : function(req, res) {
   Remote.getData(res);
  },
  getSettings : function(callback) {
   Remote.getSettings(callback);
  }
}
