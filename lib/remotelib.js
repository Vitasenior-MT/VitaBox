'use strict'
var Remote = require('./models/remotes');

Remote = new Remote();

module.exports = {
  getKey : function(code, callback) {
   Remote.getKey(code, callback);
  }
}
