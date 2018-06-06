'use strict'
var Patient = require('./models/patients.js'),
  boardlib = require('./boardlib.js');

Patient = new Patient();

module.exports = {
  postPatients: function (data, callback) {
    Patient.insert(data.patients, callback);
  },
  getData: function (req, res) {
    Patient.find(res);
  },
  getPatientInfo: function(patient, examble, res, callback){
    Patient.getInfoPatient(patient, examble, res, function(patientinfo){    
      if (patientinfo.length === 0) {
        return res.json({
          status: false,
          data: "Erro ao procurar o utilizador."
        });
      }
      callback(patientinfo);
    });
  },

  getAllPatientsIdMiBandDevice: function(callback){
    Patient.getAllPatientsIdMiBandDevice(callback); 
  },
  
  getUserExams: function (req, res) {
    Patient.getUserExams(req.params.userid, res); 
  },

  updateFlagAuthBandFit: function(data){
    Patient.updateFlagAuthBandFit(data.flag, data.user_id);
  }
}
