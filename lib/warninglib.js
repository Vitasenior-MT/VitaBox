'use strict'
var Warning = require('./models/warnings');

Warning = new Warning();

module.exports = {
  getAllWarnings : function() {
    Warning.findWarnings();
  },
  getResults : function() {
    return Warning.getResults();
  }
}
