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
  weight: { type: Number, required: true },
  bandfitness_auth: { type: Boolean, default: false },
  Boards: [{
    id: { type: String, required: true },
    location: { type: String, required: false },
    mac_addr: { type: String, required: true },
    Boardmodel: [{
      id: { type: String, required: true },
      type: { type: String, required: true },
      name: { type: String, required: true },
      tag: { type: String, required: true },
      Sensors: [{
        id: { type: String, required: true },
        transducer: { type: String, required: true },
        measure: { type: String, required: true },
        tag: { type: String, required: true }
      }]
    }]
  }]
}, { _id: false, versionKey: false });

var Patient = function () {
  this.patientdb = mongoose.model('Patient', PatientSchema);
};

Patient.prototype.find = function (res) {
  this.patientdb.find({}, { id: 1, name: 1, _id: 0 }, (err, result) => {
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

Patient.prototype.getInfoPatient = function (userid, examBle, res, callback) {
  this.patientdb.aggregate([
    { "$match": { id: userid } },
    { "$unwind": "$Boards" },
    { "$unwind": "$Boards.Boardmodel" },
    { "$match": { "Boards.Boardmodel.tag": examBle } },
    { "$project": { "_id": 0, "id": 1, "birthdate": 1, "gender": 1, "height": 1, "weight": 1, "bandfitness_auth": 1, "Boards.id": 1, "Boards.mac_addr": 1, "Boards.Boardmodel.id": 1, "Boards.Boardmodel.tag": 1 }}], 
    function (err, patient) {
      if (err) {
        return res.json({
          status: false,
          data: err
        });
      }
      let patientInfo = {
        deviceId: patient[0].id,
        birthdate: patient[0].birthdate,
        bandfitness_auth: patient[0].bandfitness_auth,
        gender: patient[0].gender,
        height: patient[0].height,
        weight: patient[0].weight,
        mac_addr: patient[0].Boards.mac_addr,
        boardId: patient[0].Boards.id,
        BoardmodelId: patient[0].Boards.Boardmodel.id,
        BoardmodelName: patient[0].Boards.Boardmodel.tag,
      }
      callback(patientInfo);
    });
}

Patient.prototype.getUserExams = function (userid, res) {
  this.patientdb.find({ "id": userid }, { _id: 0, "Boards.mac_addr": 1, "Boards.Boardmodel.tag": 1 }, function (err, examslist) {
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    let listDeviceMac = [];
    for (let index = 0; index < examslist[0].Boards.length; index++) {
      listDeviceMac.push({
        mac_addr: examslist[0].Boards[index].mac_addr,
        device: examslist[0].Boards[index].Boardmodel[0].tag
      }) 
    }
    res.json({
      status: true,
      data: listDeviceMac
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
