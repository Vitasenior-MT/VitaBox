'use strict'
require('colors');
var cp = require('child_process'),
  sleep = require('sleep'),
  utilsBle = require('./bleUtils.js'),
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
        console.log(data);
          sktcon.sendMsgToPage(data.dataSend.sktTag, data.dataSend.sktData)
        } else if (data.proc === 'saveData') {
          sensorblelib.insertBleData(data.dataSend);
        }
      });
      execCommand = false;
    }

    res.json({
      status: true,
      data: "Start Operation."
    });
  },
  /*
      bloodglucose: function(req, res) {
          var macAddress = '187a93090bc3'; 
          console.log("Ble", macAddress);
          res.json({
              status: true,
              data: "Start Operation."
          });
      },

      bodyscale: function(req, res) {
          var macAddress = '8cde5297c034'; 
          console.log("Ble", macAddress);
          res.json({
              status: true,
              data: "Start Operation."
          });

          var scale_user_profile = [];
          var user_gender = 1;   //1-Male    0-Female
          var user_height = 175; //in cm (0-255)
          var user_age = 29;     //(0-255)
          scale_user_profile = [
              0xfe,
              1,              // User group
              user_gender,    // gender: 1=male, 0=female
              0,              // level 0=normal
              user_height,    // height
              user_age,       // age
              1              // unit KG
          ];

          scale_user_profile[7] = scale_user_profile[1] ^ scale_user_profile[2] ^ scale_user_profile[3] ^ scale_user_profile[4] ^ scale_user_profile[5] ^ scale_user_profile[6];

          utilsBle.nobleGetBleState(sktcon, function(){                    
              sktcon.sendMsgToPage("bleMsg", {
                  satus: true,
                  data: "Dispositivo Ble ligado. Inicio da pesquisa."
              });
              utilsBle.nobleDetectDeviceAndConnect(macAddress, sktcon, function(device) {                
                  utilsBle.nobleDeviceReturnService(device, ["fff0"], sktcon, function(service){
                      utilsBle.nobleDeviceReturnCaract(service, ["fff4"], sktcon, function(characteristicNotify){
                          utilsBle.nobleDeviceReturnDiscriptor(characteristicNotify, '2902', sktcon, function(descriptor){
                              console.log(' Enabling Body Scale notifications status... ');
                              let command = utilsBle.dataCommand([0x01, 0x00]);
                                                         
                              utilsBle.nonleDescriptorWriteCommand(descriptor, command, sktcon, function(){

                                  utilsBle.nobleDeviceReturnCaract(service, ["fff1"], sktcon, function (characteristic) {
                                      let command = utilsBle.dataCommand(scale_user_profile); 
                                      //let command = utilsBle.createCommand(85, scale_user_profile);
                                      utilsBle.nobleCaracteristicWrite(characteristic, command, sktcon, function () {
                                          console.log("Teste1");
                                          sleep.sleep(4);
                                          utilsBle.nobleCaracteristicRead(characteristicNotify, sktcon, function(){
                                          console.log("Teste2");
                                              characteristicNotify.on('read', function (data, isNotification) {
                                                  console.log(isNotification, JSON.stringify(data, null, 2));
                                                  //recebeu algo
                                                  if (data) {
                                                      //cálculo do peso
                                                      var weight_bs = (data.readInt8(4) * 256) + data.readInt8(5);
                                                      console.log("Weight: " + (weight_bs / 10) + "kg");
                                                      let command = utilsBle.createCommand(85, [0xfd, 0x35, 0x00, 0x00, 0x00, 0x00, 0x00, 0x35]);
                                                      utilsBle.nobleCaracteristicWrite(characteristic, command, sktcon, function () {
                                                          sleep.sleep(1);
                                                          utilsBle.nobleDeviceDisConnect(device, sktcon);
                                                      });
                                                  } else {
                                                      //não recebeu nada
                                                      console.log(' Body Scale error, cant help! Response:  ' + data.toString("hex"));
                                                      utilsBle.nobleDeviceDisConnect(device, sktcon);
                                                  }
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
      }*/
}