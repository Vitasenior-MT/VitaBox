'use strict'
require('colors');
var cp = require('child_process'),
  sleep = require('sleep'),
  patientslib = require('./patientslib.js'),
  sensorblelib = require('./sensorBleLib.js'),
  sktcon = null;

module.exports = {
  addsktconn: function(skt) {
    sktcon = skt;
  },

  execBleDisp: function(req, res) {
    let dispBle = req.params.bleDisp;
    dispBle = dispBle.toLowerCase();
    let execCommand = false;
    var args = {
      options: "",
      pacientId: "123456789",
      macAddress: "",
      action: ""
    };

    patientslib.getPacientInfo(args.pacientId, args.dispBle, function(pacientInfo){
      switch (dispBle) {

        case "bloodpressure":
          args.macAddress = '508cb16b174f';
          args.action = "bloodPressure";
          execCommand = true;
          break;

        case "bodyscale":
          var opt = {
            user_grup: 1,     // User group
            user_gender: 1,   // gender: 1=male, 0=female
            user_level: 0,    // level 0=normal
            user_height: 185, // height in cm (0-255)
            user_age: 39,     // age (0-255)
            user_init_kg: 1   // unit KG
          }
          args.macAddress = '8cde5297c034';
          args.options = opt;
          args.action = "bodyscale";
          execCommand = true;       
          break;

        case "bloodglucose":
          args.macAddress = '187a93090bc3';
          args.action = "bloodglucose";
          //execCommand = true;
          break;

        case "bodytemperature":
          args.macAddress = 'a81b6aa907b9';
          args.action = "bodytemperature";
          execCommand = true;
          break;

        case "bodypulse":
          args.macAddress = '00a05004262e';
          args.action = "bodyPulse";
          execCommand = true;
          break;
        default:
          break;
      }
      if (execCommand) {
        // inicia p script e envia as configuracores do ficheiro inicial
        var child2 = cp.fork('./lib/bleServer.js');
        child2.send({
          "serverdata": args
        });
        child2.on('message', function(data) {
          if (data.proc === 'bluetooth') {
            // console.log(data);
            sktcon.sendMsgToPage(data.dataSend.sktTag, data.dataSend.sktData)
          } else if (data.proc === 'saveData') {
            // console.log(data);
            sensorblelib.insertBleData(data.dataSend);
          }
        });
        execCommand = false;
      }

      res.json({
        status: true,
        data: "Start Operation."
      });
    });   
  }
}