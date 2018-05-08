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
  getPatientInfo: function(patient, res, callback){
    Patient.getInfoPatient(patient, res, function(patientinfo){    
      if (patientinfo.length === 0) {
        return res.json({
          status: false,
          data: "Erro ao procurar o utilizador."
        });
      }
      callback(patientinfo);
    });
  },
  
  getUserExams: function (req, res) {
    Patient.getUserExams(req.params.userid, res, function(examlist){
      let arrexamlist = [];
      for (let index = 0; index < examlist[0].device_list.length; index++) {
        arrexamlist.push(examlist[0].device_list[index].device_type)
      }
      boardlib.findMacToAllDevice(res, arrexamlist)
    }); 
  },

  updateFlagAuthBandFit: function(data){
    Patient.updateFlagAuthBandFit(data.flag, data.user_id);
  }
}
