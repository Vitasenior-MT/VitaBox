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
    description: { type: String, required: false },
    mac_addr: { type: String, required: true },
    Boardmodel: {
      id: { type: String, required: true },
      type: { type: String, required: true },
      name: { type: String, required: true },
      tag: { type: String, required: true },
    },
    Sensors: [{
      id: { type: String, required: true },
      Sensormodel: {
        id: { type: String, required: true },
        transducer: { type: String, required: true },
        measure: { type: String, required: true },
        tag: { type: String, required: true },
        min_acceptable: { type: Number, required: false },
        max_acceptable: { type: Number, required: false },
        min_possible: { type: Number, required: false },
        max_possible: { type: Number, required: false }
      }
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

Patient.prototype.verify = function (res) {
  this.patientdb.find({}, (err, result) => {
    if (err) {
      console.log("error", err);
      return res({ status: false });
    }
    if (result.length > 0) {
      res({ status: true });
    } else {
      res({ status: false });
    }
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
  var query = [
    { "$match": { id: userid } },
    { "$unwind": "$Boards" },
    { "$match": { "Boards.Boardmodel.tag": examBle } },
    {
      "$project": {
        "_id": 0,
        "id": 1,
        "birthdate": 1,
        "gender": 1,
        "height": 1,
        "weight": 1,
        "bandfitness_auth": 1,
        "Boards.id": 1,
        "Boards.mac_addr": 1,
        "Boards.Boardmodel.id": 1,
        "Boards.Boardmodel.tag": 1,
        "Boards.Sensors": 1
      }
    }];
  this.patientdb.aggregate(query, function (err, patient) {
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
      Sensors: patient[0].Boards.Sensors
    }
    callback(patientInfo);
  });
}

Patient.prototype.getUserExams = function (userid, res) {
  this.patientdb.find({
    "id": userid
  }, {
      _id: 0,
      "Boards.mac_addr": 1,
      "Boards.Boardmodel.tag": 1,
      "Boards.Boardmodel.name": 1
    }, function (err, examslist) {
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
          device: examslist[0].Boards[index].Boardmodel.tag,
          name: examslist[0].Boards[index].Boardmodel.name
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

Patient.prototype.getAllPatientsIdMiBandDevice = function (callback) {
  let query = [
    { "$unwind": "$Boards" },
    { "$match": { "Boards.Boardmodel.tag": "bandfitness" } },
    {
      "$project": {
        "_id": 0,
        "id": 1,
        "bandfitness_auth": 1,
        "Boards.id": 1,
        "Boards.mac_addr": 1,
        "Boards.Boardmodel.id": 1,
        "Boards.Boardmodel.tag": 1,
        "Boards.Sensors": 1
      }
    }];
  this.patientdb.aggregate(query, function (err, patients) {
    if (err) {
      return console.log("error", err);
    }
    let patientsInfo = [];
    for (let index = 0; index < patients.length; index++) {
      patientsInfo.push({
        userId: patients[index].id,
        bandfitness_auth: patients[index].bandfitness_auth,
        mac_addr: patients[index].Boards.mac_addr,
        boardId: patients[index].Boards.id,
        BoardmodelId: patients[index].Boards.Boardmodel.id,
        BoardmodelName: patients[index].Boards.Boardmodel.tag,
        Sensors: patients[index].Boards.Sensors
      });
    }
    callback(patientsInfo);
  });
}

module.exports = Patient;
