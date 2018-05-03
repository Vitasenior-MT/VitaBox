'use strict'
var Patient = require('./models/patients.js'),
  boardlib = require('./boardlib.js');

Patient = new Patient();

module.exports = {
  postPatients: function (data, callback) {
    Patient.count(() => {
      Patient.insert(data, callback);
    });
  },
  getData: function (req, res) {
    Patient.find(res);
  },
  getPatientInfo: function(patient, disp, res, callback){
    Patient.getInfoPatient(patient, disp, res, function(patientinfo){    
      if (patientinfo.length === 0) {
        return res.json({
          status: false,
          data: "Equipamento não encontrado para este utilizador."
        });
      }
      boardlib.findMacAddressDevice(disp, patientinfo, res, callback);
    });
  },
  
  getUserExams: function (req, res) {
    Patient.getUserExams(req.params.userid, res);
  },

  updateFlagAuthBandFit: function(data){
    Patient.updateFlagAuthBandFit(data.flag, data.user_id);
  }
}
