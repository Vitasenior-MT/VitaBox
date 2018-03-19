'use strict'
var Patient = require('./models/patients.js');
Patient = new Patient();
module.exports = {
  postPatients: function (req, res) {
    Patient.findUpdateCreate(req.body.data, res);
  },
  postPatients2: function (data, callback) {
    Patient.findUpdateCreate2(data, callback);
  },
  getData: function (req, res) {
    Patient.find(res);
  }
}
