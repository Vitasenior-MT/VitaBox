'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

  var TransdutorSchema = new Schema({
    value: { type: String, required: true },
    time: { type: Date, required: true },
  }, { versionKey: false });

var PatientSchema = new Schema({
  id: { type: String, required: true },
  birthdate: { type: Date, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  since: { type: Date, required: true },
  altura: { type: String, required: true },
  transdutor: [TransdutorSchema]
}, { _id: false, versionKey: false });

var Patient = function () {
  this.patientdb = mongoose.model('Patient', PatientSchema);
};

Patient.prototype.find = function (res) {
  this.patientdb.find({}, (err, result) => {
    return err ? res.json({
      status: false,
      data: err
    }) : res.json({
      status: true,
      data: result
    });
  });
};

Patient.prototype.count = function (callback) {
  this.patientdb.count(function (err, patient) {
    if (err) {
      return console.log("Error", err);
    }
    if (patient <= 0) {
      callback();
    }
  });
};

Patient.prototype.update = function (data, res) {
  this.patientdb.updateMany(data.patients, (err, result) => { });
};

Patient.prototype.insert = function (data, callback) {
  this.patientdb.insertMany(data.patients, (err, result) => { err ? callback(err, null) : callback(null, result); });
};

module.exports = Patient;
