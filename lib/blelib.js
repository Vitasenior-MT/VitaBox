'use strict'
require('colors');
var cp = require('child_process'),
  sleep = require('sleep'),
  patientslib = require('./patientslib.js'),
  sensorblelib = require('./sensorBleLib.js'),
  sktcon = null;

module.exports = {
  addsktconn: function (skt) {
    sktcon = skt;
  },

  execBleDisp: function (req, res) {
    let dispBle = req.params.bleDisp;
    let userid = req.params.userid;
    dispBle = dispBle.toLowerCase();
    let execCommand = false;
    var args = {
      options: {},
      pacientId: userid,
      action: dispBle
    };

    patientslib.getPatientInfo(args.pacientId, args.action, res, function (pacientInfo) {
      let gender = 1;
      if (pacientInfo.gender === 'female') {
        gender = 0;
      }
      args.macAddress = pacientInfo.mac_addr;
      args.boardId = pacientInfo.boardId;
      args.deviceId = pacientInfo.deviceId;
      args.BoardmodelId = pacientInfo.BoardmodelId;
      args.options = {
        bandfitness_auth: pacientInfo.bandfitness_auth,                       // autenticação da band
        user_grup: 1,                                                               // User group
        user_gender: gender, //1,                                                   // gender: 1=male, 0=female
        user_level: 0,                                                              // level 0=normal
        user_height: pacientInfo.height.toString().replace(/[.,]/g, ""), //185, // height in cm (0-255)
        user_age: getAge(pacientInfo.birthdate), //39,                        // age (0-255)
        user_init_kg: pacientInfo.Weight //1                                  // unit KG
      }
      // inicia p script e envia as configuracores do ficheiro inicial
      var child2 = cp.fork('./lib/bleServer.js');
      child2.send({
        "serverdata": args
      });
      child2.on('message', function (data) {
        if (data.proc === 'bluetooth') {
          // console.log(data);
          sktcon.sendMsgToPage(data.dataSend.sktTag, data.dataSend.sktData)
        } else if (data.proc === 'saveDataSensors') {
          // console.log(data);
          sensorblelib.insertBleData(data.dataSend);
        } else if (data.proc === 'saveAuthPatient') {
          patientslib.updateFlagAuthBandFit(data.dataSend);
        }
      });
      res.json({
        status: true,
        data: "Inicio da execução."
      });
    });
  }
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}