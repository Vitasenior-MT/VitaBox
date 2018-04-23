'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
/*
var TransdutorSchema = new Schema({
  board_id: { type: String, required: true },
  sensor_id: { type: String, required: true },
  value: { type: String, required: true },
  time: { type: Date, required: true },
}, { versionKey: false });
*/
var PatientSchema = new Schema({
  id: { type: String, required: true },
  birthdate: { type: Date, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  since: { type: Date, required: true },
  height: { type: Number, required: true },
  Weight: { type: Number, required: true },
  device_list: [{
    device_type: { type: String, required: false }
  }]
  /*transdutor: [TransdutorSchema],
  device_list: {
    bloodpressure: { type: Boolean, required: false },
    body_temperature: { type: Boolean, required: false },
    body_pulse: { type: Boolean, required: false },
    body_scale: { type: Boolean, required: false },
    blood_glucose: { type: Boolean, required: false }
  }*/
}, { _id: false, versionKey: false });

var Patient = function () {
  this.patientdb = mongoose.model('Patient', PatientSchema);
};

Patient.prototype.find = function (res) {
  this.patientdb.find({}, (err, result) => {
    if (err) {
      console.log("error", err);
      return res.json({
        status: false,
        data: err
      })
    }
    res.json({
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

Patient.prototype.insert = function (data, callback) {
  this.patientdb.insertMany(data.patients, function (err, result) {
    if (err) {
      if (callback) {
        return callback(null, result);
      }
      return console.log("error", err);
    }
    if (callback) {
      callback(null, result);
    }
  });
};

Patient.prototype.getInfoPacient = function (userid, bledevice, res, callback) {
  this.patientdb.find(
    { "id": userid, "device_list.device_type": bledevice },
    { "gender": 1, "height": 1, "Weight": 1, "birthdate": 1 },
    function (err, pacient) {
      if (err) {
        return res.json({
          status: false,
          data: err
        });
      }
      callback(pacient);
    });
}

module.exports = Patient;
