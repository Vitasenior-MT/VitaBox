'use strict'
var Remote = require('./models/remotes');

Remote = new Remote();

module.exports = {
  getAllRemoteSettings : function() {
    Remote.findRemoteSettings();
  },
  getResults : function() {
    return Remote.getResults();
  },
  getKey : function(code, callback) {
   Remote.getKey(code, callback);
  },
  getData : function(req, res) {
   Remote.getData(res);
  }
}
