'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var PatientSchema = new Schema({
  id: { type: String, required: true },
  birthdate: { type: Date, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  since: { type: Date, required: true },
}, { _id: false, versionKey: false });

var Patient = function () {
  this.patientdb = mongoose.model('Patient', PatientSchema);
};

Patient.prototype.findUpdateCreate = function (data, res) {
  console.log('data');
  console.log(data);
  if (data.id) {
    var query = { id: data.id },
      options = { upsert: true, new: true, setDefaultsOnInsert: true },
      update = {
        id: data.id,
        birthdate: data.birthdate,
        name: data.name,
        gender: data.gender,
        since: data.since
      };
    this.patientdb.updateMany({}, data.patients, options, (err, result) => { });
  }
};

Patient.prototype.find = function (res) {
  this.patientdb.find({ }, (err, result) => {
    return err ? res.json({
      status: false,
      data: err
    }) : res.json({
      status: true,
      data: result
    });
  });
};

Patient.prototype.findUpdateCreate2 = function (data, callback) {
  this.patientdb.insertMany(data.patients, (err, result) => { err ? callback(err, null) : callback(null, result); });
};

module.exports = Patient;
