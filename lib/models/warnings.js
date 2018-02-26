'use strict'
//TODO: verificar se realmente não faz sentido existir
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var WarningsSchema = new Schema({
  warning_type: { type: String, required: true },
  header: { type: String, required: true },
  message: { type: String, required: true },
  footer: { type: String, required: true },
  color: { type: String, required: true }
});

var Warnings = function () {
  this.result = [];
  this.warningsdb = mongoose.model('Warnings', WarningsSchema);
};

Warnings.prototype.insertWarning = function (warning_type, header, message, footer, color) {
  this.warningsdb.create({
    warning_type: warning_type,
    header: header,
    message: message,
    footer: footer,
    color: color
  }, (err, warnings) => {
    if (err) {
      return console.log(err);
    }
    console.log(warnings);
  });
}

Warnings.prototype.countWarnings = function (callback) {
  this.warningsdb.count(function (err, warnings) {
    if (err) {
      return console.log("Error", err);
    }
    if (warnings <= 0) {
      callback();
    }
  });
};

Warnings.prototype.insertAllWarnings = function (params) {
  this.warningsdb.insertMany(params, function (err, result) {
    if (err) {
      return console.log(err);
    }
    console.log('insertAllWarning inserted!' /*, result*/);
  });
};

Warnings.prototype.findWarnings = function () {
  this.warningsdb.find({}, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result) {
      this.result = result;
    }
  });
};

Warnings.prototype.getResults = function () {
  return this.result;
}

module.exports = Warnings;
