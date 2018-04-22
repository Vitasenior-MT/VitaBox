'use strict'
require('colors');
var sleep = require('sleep'),
  utilsBle = require('./bleUtils.js'),
  noDevice = null,
  timeNoDevice = 60; // 1 minuto

var BleServer = function(data) {
  noDevice = setTimeout(function() {
    utilsBle.sendMsgCommand(false, "bleMsg", "Dispositivo Não Encontrado...", true)
  }, 1000 * timeNoDevice);
  this.options = data.options;
  this.pacientId = data.pacientId;
  this.macAddress = data.macAddress;
  this.action = data.action;
  this.runFuncDevice = null;
  this.start();  
}

BleServer.prototype.start = function(){
  var self = this;
  var serviceCaract = [];
  utilsBle.nobleGetBleState(function() {
    utilsBle.nobleDetectDeviceAndConnect(self.macAddress, function(device) {
      clearTimeout(noDevice);
      switch (self.action) {
        case "bloodPressure":
          serviceCaract[0] = "ffe0";
          serviceCaract[1] = "ffe1";
          self.runFuncDevice = self.bloodPressure;
          sleep.sleep(2);
          break;
        case "bodytemperature":
          serviceCaract[0] = "180f";
          serviceCaract[1] = "2a19";
          self.runFuncDevice = self.bodytemperature;
          break;
        case "bodyPulse":
          serviceCaract[0] = "49535343fe7d4ae58fa99fafd205e455";
          serviceCaract[1] = "495353431e4d4bd9ba6123c647249616";
          self.runFuncDevice = self.bodyPulse;
          break;
        case "bodyscale":
          serviceCaract[0] = 'fff0';
          serviceCaract[1] = 'fff4';
          self.runFuncDevice = self.bodyscale;
          break;
        default:
          break;
      }
      /**
       * TODO: Descoberta do serviço destinado a iniciar o processo
       */
      utilsBle.nobleDeviceReturnService(device, [serviceCaract[0]], function(service) {
        if (self.action === "bloodPressure") {
          sleep.sleep(4);          
        }
        /**
         * TODO: Descobeta da caracteristica destinada a iniciar o processo
         */
        utilsBle.nobleDeviceReturnCaract(service, [serviceCaract[1]], function(characteristic) {
          self.runFuncDevice(device, service, characteristic);
        });
      });
    });
  });
};

BleServer.prototype.bloodPressure = function(device, service, characteristic) {
  var self = this;  
  /**
   * TODO: Criação do comando para iniciar o processo
   */
  let command = utilsBle.createCommand(18, ["e".charCodeAt(0)]);
  /**
   * TODO: Envio do comando para inicio do processo
   */
  utilsBle.nobleCaracteristicWrite(characteristic, command, function() {
    /**
     * TODO: Leitura dos dados disponibilizados pelo equipamento
     */
    utilsBle.nobleCaracteristicRead(characteristic, function() {
      /**
       * TODO: Inicia a leitura dos dados disponibilizados pelo equipamento
       */
      characteristic.on('read', function(data, isNotification) {
        utilsBle.sendMsgCommand(true, "bleExec", data.toString("utf8"), false);
        // console.log("Data:", data.toString("utf8"));
        if (isNotification === true && data.toString("utf8").charAt(0) === "g") {
          //console.log("TesteFim", data.toString("utf8"), isNotification);
          utilsBle.sendMsgCommand(true, "bleExecFimPress", data.toString("utf8"), false);
          // var result = data.toString("utf8");
          var results = data.toString("utf8").split('/');
          // console.log("Systolic: ", (results[1] * 1));
          // console.log("Diastolic: ", (results[2] * 1));
          // console.log("Pulse/min: ", (results[3] * 1));
          let dataSave = {
            pacientId: self.pacientId,
            node_id: self.macAddress,
            name: self.action,
            dataBle: [{
              sensortype: "systolic",
              value: results[1]
            }, {
              sensortype: "diastolic",
              value: results[2]
            }, {
              sensortype: "pulse",
              value: results[3]
            }]
          }
          utilsBle.sendMsgSaveData(dataSave);
          sleep.sleep(1);

          /**
           * TODO: Criação do comando para desligar o equipamento
           */
          let command2 = utilsBle.createCommand(18, ["i".charCodeAt(0)]);
          /**
           * TODO: Envio do comando para desligar o equipamento 
           */
          utilsBle.nobleCaracteristicWrite(characteristic, command2, function() {

            sleep.sleep(1);
            /**
             * TODO: Desconectar o periférico
             */
            utilsBle.nobleDeviceDisConnect(device);
          });
        } else if (data.toString("utf8").charAt(0) === "h") {
          utilsBle.sendMsgCommandWarning(false, "bleExecFimPress", "Erro no equipamento, tente novamente.");
          sleep.sleep(1);
          /**
           * TODO: Criação do comando para desligar o equipamento
           */
          let command2 = utilsBle.createCommand(18, ["i".charCodeAt(0)]);
          /**
           * TODO: Envio do comando para desligar o equipamento 
           */
          utilsBle.nobleCaracteristicWrite(characteristic, command2, function() {

            sleep.sleep(1);
            /**
             * TODO: Desconectar o periférico
             */
            utilsBle.nobleDeviceDisConnect(device);
          });
        }
      }.bind(this));
    });
  });
}

BleServer.prototype.bodytemperature = function(device, service, characteristic) {
  var self = this;
  /**
   * TODO: Consulta o equipamanto Ble para saber a info da bateria
   */
  utilsBle.nobleCaracteristicRead(characteristic, function(data) {
    if (data) {
      /**
       *TODO:  Envia para a interface a info da bateria
       */
      utilsBle.sendMsgCommand(true, "bleMsgBattery", data[0], false);
      let dataSave = {
        pacientId: self.pacientId,
        node_id: self.macAddress,
        name: self.action,
        dataBle: [{
          sensortype: "battery",
          value: data[0]
        }]
      }
      /**
       * TODO: Envia para a base de dados a info da bateria
       */
      utilsBle.sendMsgSaveData(dataSave);
      sleep.sleep(1);
      /**
       * TODO: Procura paelo serviço pretendido
       */
      utilsBle.nobleDeviceReturnService(device, ["1809"], function(service) {
        /**
         * TODO: descoberta da caracteristica pretendido no serviço passado por parametro
         */
        utilsBle.nobleDeviceReturnCaract(service, ["2a1e"], function(characteristic) {
          /**
           * TODO: Descoberta do descritor da caracteristic
           */
          utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function(descriptor) {
            /**
             * TODO: Criação para comando para ativar o descritor
             */
            console.log(' Enabling Body Temperature notifications status... ');
            let command = utilsBle.dataCommand([0x01, 0x00]);
            /**
             * TODO: Envia o comando para o descritor
             */
            utilsBle.nonleDescriptorWriteCommand(descriptor, command, function() {
              sleep.sleep(4);
              /**
               * TODO: Colocaa caracteristica ca iniciar as leituras disponibilizadas pelo equipamento.
               */
              utilsBle.nobleCaracteristicRead(characteristic, function() {
                characteristic.on('read', function(data, isNotification) {
                  /**
                   * TODO: Recebeu dados 
                   */
                  if (data && isNotification) {
                    var temp = 0;
                    var tempVar = 0;
                    var th = data[1];
                    var tm = data[2];
                    var tl = data[3];
                    tempVar = tl;
                    tempVar <<= 8;
                    tempVar = tm;
                    tempVar <<= 8;
                    tempVar = tempVar | th;
                    temp = parseFloat((tempVar / 100.00));
                    // console.log("Body Temperature: " + temp + "ºC");
                    /**
                     * TODO: Envia os dados para  a interface
                     */
                    utilsBle.sendMsgCommand(true, "bleExecFimTemp", temp, false);
                    let dataSave = {
                      pacientId: self.pacientId,
                      node_id: self.macAddress,
                      name: self.action,
                      dataBle: [{
                        sensortype: "temp",
                        value: temp
                      }]
                    }
                    /**
                     * TODO: Envia os dados para  a base de dados
                     */
                    utilsBle.sendMsgSaveData(dataSave);
                    sleep.sleep(1);
                    /**
                     * TODO: Desliga o equipamento
                     */
                    utilsBle.nobleDeviceDisConnect(device);
                  } else {
                    /**
                     * TODO: Envia os dados para  a interface com warning 
                     */
                    utilsBle.sendMsgCommandWarning(false, "bleExecFimTemp", "Erro no equipamento, tente novamente.");
                    //não recebeu nada
                    console.log(' Body Temperature error, cant help! Response:  ' + data.toString("hex"));
                    /**
                     * TODO: Desliga o equipamento 
                     */
                    utilsBle.nobleDeviceDisConnect(device);
                  }
                });
              });
            });
          });
        });
      });
    }
  });
}

BleServer.prototype.bodyPulse = function(device, service, characteristic) {
  var self = this;
  utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function(descriptor) {
    console.log(' Enabling Pulsiometer notifications status... ');
    let command = utilsBle.dataCommand([0x01]);
    utilsBle.nonleDescriptorWriteCommand(descriptor, command, function() {
      sleep.sleep(5);
      utilsBle.nobleCaracteristicRead(characteristic, function() {
        characteristic.on('read', function(data, isNotification) {
          // console.log(isNotification, JSON.stringify(data, null, 2));
          //recebeu algo
          if (data && isNotification) {
            // console.log(JSON.stringify(data, null, 2));
            var pulse_spo = parseInt(data[2]);
            var spo2 = parseInt(data[1]);

            // console.log("SpO2: " + spo2 + "%");
            // console.log("Pulse: " + pulse_spo + "ppm");
            console.log(' Disabling Pulsiometer notifications status... ');
            let dataSend = {
              spo2: spo2,
              pulse: pulse_spo
            };
            utilsBle.sendMsgCommand(true, "bleExecFimPulse", dataSend, false);
            let dataSave = {
              pacientId: self.pacientId,
              node_id: self.macAddress,
              name: self.action,
              dataBle: [{
                sensortype: "spo2",
                value: spo2
              }, {
                sensortype: "pulse",
                value: pulse_spo
              }]
            }
            utilsBle.sendMsgSaveData(dataSave);
            //sleep.sleep(1);
            let command = utilsBle.dataCommand([0x00]);
            utilsBle.nonleDescriptorWriteCommand(descriptor, command, function() {
              /**
             * TODO: Desliga o equipamento 
             */
              utilsBle.nobleDeviceDisConnect(device);
            });
          } else {
            //não recebeu nada
            console.log(' Pulsiometer error, cant help! Response:  ' + data.toString("hex"));
            utilsBle.sendMsgCommandWarning(false, "bleExecFimPulse", "Erro no equipamento, tente novamente.");
            
            let command = utilsBle.dataCommand([0x00]);

            utilsBle.nonleDescriptorWriteCommand(descriptor, command, function() {
              /**
             * TODO: Desliga o equipamento 
             */
              utilsBle.nobleDeviceDisConnect(device);
            });
          }
        });
      });
    });
  });
}

BleServer.prototype.bodyscale = function(device, service, characteristic){
  let self = this;
  utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function(descriptor) {
    console.log(' Enabling Body Scale notifications status... ');
    let command = utilsBle.dataCommand([0x01, 0x00]);
    utilsBle.nonleDescriptorWriteCommand(descriptor, command, function() {
      utilsBle.nobleDeviceReturnCaract(service, ['fff1'], function(characteristicWriteCommand) { 
        var scale_user_profile  = [
          0xfe,
          self.options.user_grup,      // User group
          self.options.user_gender,    // gender: 1=male, 0=female
          self.options.user_level,     // level 0=normal
          self.options.user_height,    // height
          self.options.user_age,       // age
          self.options.user_init_kg    // unit KG
        ];
        scale_user_profile[7] = scale_user_profile[1] ^ scale_user_profile[2] ^ scale_user_profile[3] ^ scale_user_profile[4] ^ scale_user_profile[5] ^ scale_user_profile[6];
        let command = utilsBle.dataCommand(scale_user_profile);
        utilsBle.nobleCaracteristicWrite(characteristicWriteCommand, command, function() {
          sleep.sleep(2);
          utilsBle.nobleCaracteristicRead(characteristic, function() {
            characteristic.on('read', function(data, isNotification) {
              //recebeu algo
              if (isNotification && data) {
                //cálculo do peso
                var scaleData = {};
                let scale_weight_high = data[4];
                let scale_weight_low = data[5];

                let scale_bodyfat_high = data[6];
                let scale_bodyfat_low = data[7];

                let scale_musclemass_high = data[9];
                let scale_musclemass_low = data[10];

                scaleData.visceralfat = data[11];

                let scale_water_high = data[12];
                let scale_water_low = data[13];

                let scale_calories_high = data[14];
                let scale_calories_low = data[15];

                scaleData.weight = (scale_weight_high * 256) + scale_weight_low;
                scaleData.bodyfat = (scale_bodyfat_high * 256) + scale_bodyfat_low;
                scaleData.musclemass = (scale_musclemass_high * 256) + scale_musclemass_low;
                scaleData.water = (scale_water_high * 256) + scale_water_low;
                scaleData.calories = (scale_calories_high * 256) + scale_calories_low;

                scaleData.bonemass = data[8] * 1000 / scaleData.weight;

                scaleData = {
                  weight: (scaleData.weight / 10),
                  bodyfat: (scaleData.bodyfat / 10),
                  bonemass: (scaleData.bonemass / 10),
                  musclemass: (scaleData.musclemass / 10),
                  visceralfat: scaleData.visceralfat,
                  water: (scaleData.water / 10),
                  calories: scaleData.calories
                }
                let dataSave = {
                  pacientId: self.pacientId,
                  node_id: self.macAddress,
                  name: self.action,
                  dataBle: [{
                    sensortype: "weight",
                    value: scaleData.weight
                  }, {
                    sensortype: "body fat",
                    value: scaleData.bodyfat
                  }, {
                    sensortype: "bone mass",
                    value: scaleData.bonemass
                  }, {
                    sensortype: "muscle mass",
                    value: scaleData.musclemass
                  }, {
                    sensortype: "visceral fat",
                    value: scaleData.visceralfat
                  }, {
                    sensortype: "water percentage",
                    value: scaleData.water
                  }, {
                    sensortype: "calories",
                    value: scaleData.calories
                  }]
                }
                utilsBle.sendMsgSaveData(dataSave);

                // console.log("Weight: ", scaleData.weight, "Kg");
                // console.log("Body fat: ", scaleData.bodyfat, "%");
                // console.log("Bone mass: ", scaleData.bonemass, "%");
                // console.log("Muscle mass: ", scaleData.musclemass, "%");
                // console.log("Visceral fat: ", scaleData.visceralfat, "%");
                // console.log("Water percentage: ", scaleData.water, "%");
                // console.log("Calories: ", scaleData.calories, "Kcal");

                utilsBle.sendMsgCommand(true, "bleExecFimScale", scaleData, false);
                sleep.sleep(1);

                var shutdown_bs = utilsBle.dataCommand([0xfd, 0x35, 0x00, 0x00, 0x00, 0x00, 0x00, 0x35]);
                utilsBle.nobleCaracteristicWrite(characteristicWriteCommand, shutdown_bs, function() {
                  /**
                 * TODO: Desliga o equipamento 
                 */
                  utilsBle.nobleDeviceDisConnect(device);
                });
              } else {
                //não recebeu nada
                console.log(' Body Scale error, cant help! Response:  ', data.toString("hex"));
                utilsBle.sendMsgCommandWarning(false, "bleExecFimScale", "Erro no equipamento, tente novamente.");      

                sleep.sleep(1);

                var shutdown_bs = utilsBle.dataCommand([0xfd, 0x35, 0x00, 0x00, 0x00, 0x00, 0x00, 0x35]);
                utilsBle.nobleCaracteristicWrite(characteristicWriteCommand, shutdown_bs, function() {
                    /**
                   * TODO: Desliga o equipamento 
                   */
                  utilsBle.nobleDeviceDisConnect(device);
                });
              }
            });
          });
        });
      });
    });
  });
}
/**
 * TODO: recebe por parametro no proceso as definições configuradas para o funcionamento do Bluetooth
 */
process.on("message", function(data) {
  new BleServer(data.serverdata);
});

module.exports = BleServer;