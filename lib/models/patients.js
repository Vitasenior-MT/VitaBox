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
  height: { type: Number, required: true },
  Weight: { type: Number, required: true },
  bandfitness_auth: { type: Boolean, default: false },
  device_list: [{
    device_type: { type: String, required: false }
  }]
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

Patient.prototype.getInfoPatient = function (userid, bledevice, res, callback) {
  this.patientdb.find(
    { "id": userid, "device_list.device_type": bledevice },
    { "gender": 1, "height": 1, "Weight": 1, "birthdate": 1, "bandfitness_auth": 1 },
    function (err, patient) {
      if (err) {
        return res.json({
          status: false,
          data: err
        });
      }
      callback(patient);
    });
}

Patient.prototype.getUserExams = function (userid, res) {
  this.patientdb.find({ "id": userid }, { "device_list.device_type": 1 }, function (err, examslist) {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    res.json({
      status: true,
      data: examslist
    });
  });

}

Patient.prototype.updateFlagAuthBandFit = function (flag, userid) {
  this.patientdb.update(
    { "id": userid },
    { $set: { "bandfitness_auth": flag } },
    { upsert: true },
    function (err, result) {
      if (err) {
        return console.log("Error", err);
      }
      // console.log("Success", result);
    });
}

module.exports = Patient;
