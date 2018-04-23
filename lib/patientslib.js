'use strict'
var Patient = require('./models/patients.js'),
  Board = require('./models/boards.js');

Patient = new Patient();
Board = new Board();

module.exports = {
  postPatients: function (data, callback) {
    Patient.count(() => {
      Patient.insert(data, callback);
    });
  },
  getData: function (req, res) {
    Patient.find(res);
  },
  getPacientInfo: function(pacient, disp, res, callback){
    Patient.getInfoPacient(pacient, disp, res, function(pacientinfo){    
      if (pacientinfo.length === 0) {
        return res.json({
          status: false,
          data: "Equipamento não encontado para este utilizador."
        });
      }
      Board.findMacAddressDevice(disp, pacientinfo, res, callback);
    });
  }
}
