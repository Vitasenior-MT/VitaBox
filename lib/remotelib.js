'use strict'
var Remote = require('./models/remotes');

Remote = new Remote();

module.exports = {
  getAllRemoteSettings : function() {
    Remote.findRemoteSettings();
  },
  getResults : function() {
    return Remote.getResults();
  }
}
