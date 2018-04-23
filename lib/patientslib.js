'use strict'
var Patient = require('./models/patients.js');
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
  getPacientInfo: function(pacient, disp, callback){

  }
}
