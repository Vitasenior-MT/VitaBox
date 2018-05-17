'use strict'
require('colors');
var sleep = require('sleep'),
  utilsBle = require('./bleUtils.js'),
  aesjs = require('aes-js'),
  noDevice = null,
  timeNoDevice = 60; // 1 minuto

var BleServer = function (data) {
  noDevice = setTimeout(function () {
    utilsBle.sendMsgCommand(false, "bleMsg", "Dispositivo Não Encontrado...", true)
  }, 1000 * timeNoDevice);
  this.options = data.options;
  this.pacientId = data.pacientId;
  this.macAddress = data.macAddress;
  this.action = data.action;
  this.boardId = data.boardId;
  this.deviceId = data.deviceId;
  this.BoardmodelId = data.BoardmodelId;
  this.modeAuto = data.modeAuto;
  this.sensors = (function () {
    let arr = [];
    for (let index = 0; index < data.sensors.length; index++) {
      arr[data.sensors[index].Sensormodel.tag] = {
        id: data.sensors[index].id,
        idTranducer: data.sensors[index].Sensormodel.id,
        measure: data.sensors[index].Sensormodel.measure,
        tag: data.sensors[index].Sensormodel.tag
      }
    }
    return arr;
  })();
  this.runFuncDevice = null;
}

BleServer.prototype.start = function () {
  var self = this;
  var serviceCaract = [];
  utilsBle.nobleGetBleState(function () {
    utilsBle.nobleDetectDeviceAndConnect(self.macAddress, function (device) {
      clearTimeout(noDevice);
      switch (self.action) {
        case "bloodpressure":
          serviceCaract = ["ffe0", "ffe1"];
          self.runFuncDevice = "bloodpressure";
          sleep.sleep(2);
          break;
        case "bodytemperature":
          serviceCaract = ["180f", "2a19"];
          self.runFuncDevice = "bodytemperature";
          break;
        case "bodypulse":
          serviceCaract = ["49535343fe7d4ae58fa99fafd205e455", "495353431e4d4bd9ba6123c647249616"];
          self.runFuncDevice = "bodypulse";
          break;
        case "bodyscale":
          serviceCaract = ['fff0', 'fff4'];
          self.runFuncDevice = "bodyscale";
          break;
        case "bandfitness":
          serviceCaract = ['fee1', '000000090000351221180009af100700'];
          self.runFuncDevice = "bandfitness";
          break;
        default:
          break;
      }

      self.deviceDefaultDiscover(device, serviceCaract, self.runFuncDevice);
    });
  });
};

BleServer.prototype.deviceDefaultDiscover = function (device, serviceCaract, nextExec, others) {
  var self = this;
  /**
   * TODO: Descoberta do serviço destinado a iniciar o processo
   */
  utilsBle.nobleDeviceReturnService(device, [serviceCaract[0]], function (service) {
    if (self.action === "bloodpressure") {
      sleep.sleep(4);
    }
    /**
     * TODO: Descobeta da caracteristica destinada a iniciar o processo
     */
    utilsBle.nobleDeviceReturnCaract(service, [serviceCaract[1]], function (characteristic) {
      self[nextExec](device, service, characteristic, others);
    });
  });
}

BleServer.prototype.bloodpressure = function (device, service, characteristic) {
  var self = this;
  /**
   * TODO: Criação do comando para iniciar o processo
   */
  let command = utilsBle.createCommand(18, ["e".charCodeAt(0)]);
  /**
   * TODO: Envio do comando para inicio do processo
   */
  utilsBle.nobleCaracteristicWrite(characteristic, command, true, function () {
    /**
     * TODO: Inicia a leitura dos dados disponibilizados pelo equipamento
     */
    characteristic.on('read', function (data, isNotification) {
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

        let dataSave = [{
          id: self.pacientId + "-" + self.macAddress,
          bio: true,
          board_id: self.boardId,
          sensor_id: self.sensors["systolic"].id,
          transducer: self.sensors["systolic"].tag,
          measure: self.sensors["systolic"].measure,
          datetime: new Date(),
          value: results[1]
        }, {
          id: self.pacientId + "-" + self.macAddress,
          bio: true,
          board_id: self.boardId,
          sensor_id: self.sensors["diastolic"].id,
          transducer: self.sensors["diastolic"].tag,
          measure: self.sensors["diastolic"].measure,
          datetime: new Date(),
          value: results[2]
        }, {
          id: self.pacientId + "-" + self.macAddress,
          bio: true,
          board_id: self.boardId,
          sensor_id: self.sensors["pulse"].id,
          transducer: self.sensors["pulse"].tag,
          measure: self.sensors["pulse"].measure,
          datetime: new Date(),
          value: results[3]
        }]

        utilsBle.sendMsgSaveData(dataSave);
        sleep.sleep(1);

        /**
         * TODO: Criação do comando para desligar o equipamento
         */
        let command2 = utilsBle.createCommand(18, ["i".charCodeAt(0)]);
        /**
         * TODO: Envio do comando para desligar o equipamento 
         */
        utilsBle.nobleCaracteristicWrite(characteristic, command2, true, function () {

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
        utilsBle.nobleCaracteristicWrite(characteristic, command2, true, function () {

          sleep.sleep(1);
          /**
           * TODO: Desconectar o periférico
           */
          utilsBle.nobleDeviceDisConnect(device);
        });
      }
    });
  });
}

BleServer.prototype.bodytemperature = function (device, service, characteristic) {
  var self = this;
  /**
   * TODO: Consulta o equipamanto Ble para saber a info da bateria
   */
  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {
      /**
       *TODO:  Envia para a interface a info da bateria
       */
      utilsBle.sendMsgCommand(true, "bleMsgBattery", data[0], false);
      sleep.sleep(1);
      /**
       * TODO: Procura paelo serviço pretendido
       */
      utilsBle.nobleDeviceReturnService(device, ["1809"], function (service) {
        /**
         * TODO: descoberta da caracteristica pretendido no serviço passado por parametro
         */
        utilsBle.nobleDeviceReturnCaract(service, ["2a1e"], function (characteristictemp) {
          /**
           * TODO: Descoberta do descritor da caracteristic
           */
          utilsBle.nobleDeviceReturnDiscriptor(characteristictemp, '2902', function (descriptor) {
            /**
             * TODO: Criação para comando para ativar o descritor
             */
            console.log(' Enabling Body Temperature notifications status... ');
            let command = utilsBle.dataCommand([0x01, 0x00]);
            /**
             * TODO: Envia o comando para o descritor
             */
            utilsBle.nonleDescriptorWriteCommand(descriptor, command, function () {
              sleep.sleep(4);
              characteristictemp.on('read', function (data, isNotification) {
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
                  let dataSave = [{
                    id: self.pacientId + "-" + self.macAddress,
                    bio: true,
                    board_id: self.boardId,
                    sensor_id: self.sensors["temp"].id,
                    transducer: self.sensors["temp"].tag,
                    measure: self.sensors["temp"].measure,
                    datetime: new Date(),
                    value: temp
                  }]
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
    }
  });
}

BleServer.prototype.bodypulse = function (device, service, characteristic) {
  var self = this;
  utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function (descriptor) {
    console.log(' Enabling Pulsiometer notifications status... ');
    let command = utilsBle.dataCommand([0x01]);
    utilsBle.nonleDescriptorWriteCommand(descriptor, command, function () {
      sleep.sleep(5);
      utilsBle.nobleCaracteristicRead(characteristic, function () {
        characteristic.on('read', function (data, isNotification) {
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
            let dataSave = [{
              id: self.pacientId + "-" + self.macAddress,
              bio: true,
              board_id: self.boardId,
              sensor_id: self.sensors["spo2"].id,
              transducer: self.sensors["spo2"].tag,
              measure: self.sensors["spo2"].measure,
              datetime: new Date(),
              value: spo2
            }, {
              id: self.pacientId + "-" + self.macAddress,
              bio: true,
              board_id: self.boardId,
              sensor_id: self.sensors["pulse"].id,
              transducer: self.sensors["pulse"].tag,
              measure: self.sensors["pulse"].measure,
              datetime: new Date(),
              value: pulse_spo
            }]
            utilsBle.sendMsgSaveData(dataSave);
            //sleep.sleep(1);
            let command = utilsBle.dataCommand([0x00]);
            utilsBle.nonleDescriptorWriteCommand(descriptor, command, function () {
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

            utilsBle.nonleDescriptorWriteCommand(descriptor, command, function () {
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

BleServer.prototype.bodyscale = function (device, service, characteristic) {
  let self = this;
  utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function (descriptor) {
    console.log(' Enabling Body Scale notifications status... ');
    let command = utilsBle.dataCommand([0x01, 0x00]);
    utilsBle.nonleDescriptorWriteCommand(descriptor, command, function () {
      utilsBle.nobleDeviceReturnCaract(service, ['fff1'], function (characteristicWriteCommand) {
        var scale_user_profile = [
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
        utilsBle.nobleCaracteristicWrite(characteristicWriteCommand, command, true, function () {
          sleep.sleep(2);
          characteristic.on('read', function (data, isNotification) {
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
                weight: ((Math.round(scaleData.weight / 10) * 100) / 100),
                bodyfat: ((Math.round(scaleData.bodyfat / 10) * 100) / 100),
                bonemass: ((Math.round(scaleData.bonemass / 10) * 100) / 100),
                musclemass: ((Math.round(scaleData.musclemass / 10) * 100) / 100),
                visceralfat: ((Math.round(scaleData.visceralfat) * 100) / 100),
                water: (((Math.round(scaleData.water / 10)) * 100) / 100),
                calories: (Math.round(scaleData.calories * 100) / 100)
              }
              let dataSave = [{
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["weight"].id,
                transducer: self.sensors["weight"].tag,
                measure: self.sensors["weight"].measure,
                datetime: new Date(),
                value: scaleData.weight
              }, {
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["bodyfat"].id,
                transducer: self.sensors["bodyfat"].tag,
                measure: self.sensors["bodyfat"].measure,
                datetime: new Date(),
                value: scaleData.bodyfat
              }, {
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["bonemass"].id,
                transducer: self.sensors["bonemass"].tag,
                measure: self.sensors["bonemass"].measure,
                datetime: new Date(),
                value: scaleData.bonemass
              }, {
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["musclemass"].id,
                transducer: self.sensors["musclemass"].tag,
                measure: self.sensors["musclemass"].measure,
                datetime: new Date(),
                value: scaleData.musclemass
              }, {
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["visceralfat"].id,
                transducer: self.sensors["visceralfat"].tag,
                measure: self.sensors["visceralfat"].measure,
                datetime: new Date(),
                value: scaleData.visceralfat
              }, {
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["water"].id,
                transducer: self.sensors["water"].tag,
                measure: self.sensors["water"].measure,
                datetime: new Date(),
                value: scaleData.water
              }, {
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["calories"].id,
                transducer: self.sensors["calories"].tag,
                measure: self.sensors["calories"].measure,
                datetime: new Date(),
                value: scaleData.calories
              }];

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
              utilsBle.nobleCaracteristicWrite(characteristicWriteCommand, shutdown_bs, true, function () {
                sleep.sleep(1);
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
              utilsBle.nobleCaracteristicWrite(characteristicWriteCommand, shutdown_bs, true, function () {
                sleep.sleep(1);
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
}

BleServer.prototype.bandfitness = function (device, service, characteristic) {
  var self = this;
  //procura descriptor para ativar autenticação
  utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function (descriptor) {
    console.log(' Enabling Auth Service notifications status... ');
    let command = utilsBle.dataCommand([0x01, 0x00]);
    //enviar o comando 0100 para ativar notificações 
    utilsBle.nonleDescriptorWriteCommand(descriptor, command, function () {
      sleep.sleep(2);
      var secret_key = "";
      utilsBle.sendMsgCommand(true, "bleMsg", "A autenticar o equipamento.", false);
      if (!self.options.bandfitness_auth) {
        //os 2 primeiros bytes sao o comando 0108 e os restantes são a chave 30-45 (chave tamanho 16 para encriptação AES modo ECB)
        secret_key = utilsBle.dataCommand([0x01, 0x08, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42, 0x43, 0x44, 0x45]);
        console.log(' Sending Key... ');

      } else {
        secret_key = utilsBle.dataCommand([0x02, 0x08]);
        console.log(' Sending Key if auth... ');
      }

      utilsBle.nobleCaracteristicWrite(characteristic, secret_key, true, function () {

        characteristic.on('read', function (data, isNotification) {
          //variáveis para verificação de notificações
          var aux1 = new Buffer([0x10, 0x01, 0x01]);
          var aux2 = new Buffer([0x10, 0x01, 0x04]);
          var aux3 = new Buffer([0x10, 0x02, 0x01]);
          var aux4 = new Buffer([0x10, 0x02, 0x04]);
          var aux5 = new Buffer([0x10, 0x03, 0x01]);
          var aux6 = new Buffer([0x10, 0x03, 0x04]);

          //se a reposta for {0x10, 0x01, 0x01} pede um número random à miband
          if (data.includes(aux1)) {
            console.log(' Requesting random number... ');
            //comando para pedir número random à miband
            var send_random_number = utilsBle.dataCommand([0x02, 0x08]);
            //enviar para a miband 
            utilsBle.nobleCaracteristicWrite(characteristic, send_random_number, true, function () {
              console.log("send_random_number");
            });
            sleep.sleep(1);

            //se a resposta for {0x10, 0x01, 0x04} então houve erro ao enviar a chave "secreta"
          } else if (data.includes(aux2)) {
            console.log(' Something went wrong while sending the key! ');
            // console.log(' Response: ' + data.toString("hex"));

            // update flag de autenticação da banda ao utilizador.
            utilsBle.sendAuthFlagPatient(false, self.pacientId);

            utilsBle.sendMsgCommand(false, "bleMsg", "Erro no envio da chave.", false);
            //desconecta a miband
            utilsBle.nobleDeviceDisConnect(device);

            //se a reposta for {0x10, 0x02, 0x01} inicia encriptação e envia número random encriptado
          } else if (data.includes(aux3)) {
            //guarda os últimos 16 bytes da mensagem
            var rand_number = data.slice(3, data.length);
            console.log(' Random number received... ');

            //comando a enviar
            var send_encripted_key = new Buffer([0x03, 0x08]);
            console.log(' Making key... ');

            //processo de encriptação do número recebido através de AES/ECB/NoPadding
            var aesEcb = new aesjs.ModeOfOperation.ecb(new Buffer([0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42, 0x43, 0x44, 0x45]));
            console.log(' Encrypting random number... ');

            //colocar resultado num buffer de modo a enviar
            var encryptedBytes = new Buffer(aesEcb.encrypt(rand_number));
            //tamanho do buffer a enviar
            var totalLength = send_encripted_key.length + encryptedBytes.length;
            //concatenação do buffer com o comando e o buffer com o resultado da encriptação
            var send_cmd = Buffer.concat([send_encripted_key, encryptedBytes], totalLength);

            utilsBle.sendMsgCommand(true, "bleMsg", "A continuar o preocesso de autenticação.", false);
            console.log(' Sending encrypted random number... ');
            //enviar tudo
            utilsBle.nobleCaracteristicWrite(characteristic, send_cmd, true, function () {
              console.log("send_cmd");
            });
            sleep.sleep(1);

            //se a resposta for {0x10, 0x02, 0x04} então houve erro a pedir número random  
          } else if (data.includes(aux4)) {
            console.log(' Authention failed! Something wrong when requesting the random number... ');
            // console.log(' Response: ' + data.toString("hex"));

            // update flag de autenticação da banda ao utilizador.
            utilsBle.sendAuthFlagPatient(false, self.pacientId);

            utilsBle.sendMsgCommand(false, "bleMsg", "Erro na autenticação do equipamento.", false);

            //desconecta a miband
            utilsBle.nobleDeviceDisConnect(device);

            //se a reposta for {0x10, 0x03, 0x01} então houve sucesso na autenticação da miband/raspberry 
          } else if (data.includes(aux5)) {
            console.log(' Authenticated! ');

            //desativa processo de notificações
            console.log(' Disabling Auth Service notifications status... ');
            var command = utilsBle.dataCommand([0x00, 0x00]);

            //envia comando para desativar notificações
            utilsBle.nonleDescriptorWriteCommand(descriptor, command, function () {
              console.log(' Stop notificações ');

              utilsBle.sendMsgCommand(true, "bleMsg", "Autenticação do equipamento efetuado com êxito.", false);
              // update flag de autenticação da banda ao utilizador.
              utilsBle.sendAuthFlagPatient(true, self.pacientId);

              // self.bandfitnessDeviceExec(device, "all");
              self.bandfitnessDeviceExec(device, ["heartrate", "steps", "devicename", "batterystatus"]);
            });

            //se a resposta for {0x10, 0x03, 0x04} então houve erro a enviar o número random encriptado e tenta iniciar processo novamente
          } else if (data.includes(aux6)) {
            console.log(' Encryption Key Auth Fail, sending new Key... ');
            console.log(' Sending Key... ');
            var send_secret_key = new Buffer([0x01, 0x00], SECRET_KEY);

            utilsBle.sendMsgCommand(false, "bleMsg", "Falha na autenticação do equipamento.", false);
            utilsBle.nobleCaracteristicWrite(characteristic, send_secret_key, true, function () {
              console.log("send_secret_key");
            });

            //se não encontra nada - GRAVE
          } else {
            console.log(' Auth error, cant help!');

            utilsBle.sendMsgCommand(false, "bleMsg", "Erro na autenticação do equipamento.", false);
            // update flag de autenticação da banda ao utilizador.
            utilsBle.sendAuthFlagPatient(false, self.pacientId);

            //desconecta a miband
            utilsBle.nobleDeviceDisConnect(device);
          }
        });
      });
    });
  });
}

BleServer.prototype.bandfitnessDeviceExec = function (device, nextActions) {
  var self = this;

  let optionsExecutions = [];
  let execactions = [];

  optionsExecutions["caloriesdisplay"] = {
    option: "heartrate",
    opts: ['fee0', '000000030000351221180009af100700'],
    nextExec: "bandfitnessCaloriesDisplay"
  }

  optionsExecutions["heartrate"] = {
    option: "heartrate",
    opts: ['180d', '2a37'],
    nextExec: "bandfitnessHeartRate"
  };
  optionsExecutions["steps"] = {
    option: "steps",
    opts: ['fee0', '000000070000351221180009af100700'],
    nextExec: "bandfitnessSteps"
  };
  optionsExecutions["batterystatus"] = {
    option: "batterystatus",
    opts: ['fee0', '000000060000351221180009af100700'],
    nextExec: "bandfitnessBatteryStatus"
  };
  optionsExecutions["time"] = {
    option: "time",
    opts: ['fee0', '2a2b'],
    nextExec: "bandfitnessTime"
  };
  optionsExecutions["softwarerevision"] = {
    option: "softwarerevision",
    opts: ['180a', '2a28'],
    nextExec: "bandfitnessSoftwareRevision"
  };
  optionsExecutions["hardwarerevision"] = {
    option: "hardwarerevision",
    opts: ['180a', '2a27'],
    nextExec: "bandfitnessHardwareRevision"
  };
  optionsExecutions["serialnumber"] = {
    option: "serialnumber",
    opts: ['180a', '2a25'],
    nextExec: "bandfitnessSerialNumber"
  };
  optionsExecutions["devicename"] = {
    option: "devicename",
    opts: ['1800', '2a00'],
    nextExec: "bandfitnessDeviceName"
  };

  if (nextActions === "all") {
    for (let index in optionsExecutions) {
      execactions.push(optionsExecutions[index]);
    }
  } else if (Array.isArray(nextActions)) {
    for (let index in nextActions) {
      execactions.push(optionsExecutions[nextActions[index]]);
    }
  } else {
    execactions = [];
  }
  if (execactions.length > 0) {
    let optsArray = execactions.pop();
    self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, execactions);
  }
}

BleServer.prototype.bandfitnessDeviceName = function (device, service, characteristic, others) {
  var self = this;

  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {
      var DeviceName = data.toString("utf8");
      // console.log('  Device Name: ' + DeviceName);
      utilsBle.sendMsgCommand(true, "bleMsg", "Ligado ao equipamento " + DeviceName + ".", false);
      let dataSend = {
        status: true,
        exec: "devicename",
        data: DeviceName
      };
      // utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);

      if (others.length > 0) {
        let optsArray = others.pop();
        self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
      } else {
        utilsBle.nobleDeviceDisConnect(device);
      }
    }
  });
}

BleServer.prototype.bandfitnessSerialNumber = function (device, service, characteristic, others) {
  var self = this;

  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {
      var ServialNumberString = data.toString("utf8");
      // console.log('  Serial Number String: ' + ServialNumberString);
      let dataSend = {
        status: true,
        exec: "servialnumber",
        data: ServialNumberString
      };
      utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);
      if (others.length > 0) {
        let optsArray = others.pop();
        self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
      } else {
        utilsBle.nobleDeviceDisConnect(device);
      }
    }
  });
}

BleServer.prototype.bandfitnessHardwareRevision = function (device, service, characteristic, others) {
  var self = this;
  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {
      var HardwareRevisionString = data.toString("utf8");
      // console.log('  Hardware Revision String: ' + HardwareRevisionString);
      let dataSend = {
        status: true,
        exec: "hardwarerevision",
        data: HardwareRevisionString
      };
      utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);
      if (others.length > 0) {
        let optsArray = others.pop();
        self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
      } else {
        utilsBle.nobleDeviceDisConnect(device);
      }
    }
  });

}

BleServer.prototype.bandfitnessSoftwareRevision = function (device, service, characteristic, others) {
  var self = this;
  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {
      var SoftwareRevisionString = data.toString("utf8");
      // console.log('  Software Revision String: ' + SoftwareRevisionString);
      let dataSend = {
        status: true,
        exec: "softwarerevision",
        data: SoftwareRevisionString
      };
      utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);
      if (others.length > 0) {
        let optsArray = others.pop();
        self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
      } else {
        utilsBle.nobleDeviceDisConnect(device);
      }
    }
  });

}

BleServer.prototype.bandfitnessTime = function (device, service, characteristic, others) {
  var self = this;

  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {
      var TimeInfo = data;
      var year = (TimeInfo[1] + 2011) * 1;
      var month = (TimeInfo[2]) * 1;
      var day = (TimeInfo[3]) * 1;
      var hour = (TimeInfo[4] + 1) * 1;
      var minute = (TimeInfo[5]) * 1;
      var second = (TimeInfo[6]) * 1;
      var time = '  TIME : ' + day + '/' + month + '/' + year + ' at ' + hour + ':' + minute + ':' + second;
      // console.log(time);
      let dataSend = {
        status: true,
        exec: "softwarerevision",
        data: {
          day: day,
          month: month,
          year: year,
          hour: hour,
          minute: minute,
          second: second
        }
      };
      utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);
      if (others.length > 0) {
        let optsArray = others.pop();
        self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
      } else {
        utilsBle.nobleDeviceDisConnect(device);
      }
    }
  });
}

BleServer.prototype.bandfitnessBatteryStatus = function (device, service, characteristic, others) {
  var self = this;
  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {
      var BatteryInfo = data;
      // console.log(JSON.stringify(BatteryInfo, null, 2));
      /*console.log('  Battery level : ' + BatteryInfo[1] + '%');
      console.log('  + last time full charged : ' + BatteryInfo[6] + '/' + BatteryInfo[5] + '/' + (BatteryInfo[4] + 2011) + ' at ' + BatteryInfo[7] + 'h' + BatteryInfo[8] + ':' + BatteryInfo[9]);
      console.log('  + last time charged : ' + BatteryInfo[14] + '/' + BatteryInfo[13] + '/' + (BatteryInfo[12] + 2011) + ' at ' + BatteryInfo[15] + 'h' + BatteryInfo[16] + ':' + BatteryInfo[17]);
      console.log('  + charge cycles : ' + BatteryInfo[18]);
      console.log('  + status (1=low, 2=charging, 3=full, 4=not charging): ' + (BatteryInfo[19] / 100));
      */
      let dataSend = {
        status: true,
        exec: "batterystatus",
        data: {
          battery_level: BatteryInfo[1] * 1,
          last_time_full: (BatteryInfo[6] + '/' + BatteryInfo[5] + '/' + (BatteryInfo[4] + 2011) + ' ' + BatteryInfo[7] + 'h' + BatteryInfo[8] + ':' + BatteryInfo[9]),
          last_time_charged: (BatteryInfo[14] + '/' + BatteryInfo[13] + '/' + (BatteryInfo[12] + 2011) + ' ' + BatteryInfo[15] + 'h' + BatteryInfo[16] + ':' + BatteryInfo[17]),
          charge_cycles: BatteryInfo[18],
          status: (BatteryInfo[19] / 100)
        }
      };
      utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);
      if (others.length > 0) {
        let optsArray = others.pop();
        self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
      } else {
        utilsBle.nobleDeviceDisConnect(device);
      }
    }
  });

}

BleServer.prototype.bandfitnessSteps = function (device, service, characteristic, others) {
  var self = this;

  utilsBle.nobleCaracteristicRead(characteristic, function (data) {
    if (data) {

      var StepsInfo = data;
      var a, b, c;
      a = (StepsInfo[1] && StepsInfo[1] !== undefined && StepsInfo[1] !== "undefined" ? (StepsInfo[1] * 1) : 0)
      a += (StepsInfo[2] && StepsInfo[2] !== undefined && StepsInfo[2] !== "undefined" ? (StepsInfo[2] * 1) : 0) * 256
      //a += (StepsInfo[3] && StepsInfo[3] !== undefined && StepsInfo[3] !== "undefined" ? (StepsInfo[3] * 1) : 0)
      b = (StepsInfo[5] && StepsInfo[5] !== undefined && StepsInfo[5] !== "undefined" ? (StepsInfo[5] * 1) : 0)
      b += (StepsInfo[6] && StepsInfo[6] !== undefined && StepsInfo[6] !== "undefined" ? (StepsInfo[6] * 1) : 0)
      b += (StepsInfo[7] && StepsInfo[7] !== undefined && StepsInfo[7] !== "undefined" ? (StepsInfo[7] * 1) : 0)

      c = (StepsInfo[9] && StepsInfo[9] !== undefined && StepsInfo[9] !== "undefined" ? (StepsInfo[9] * 1) : 0)
      /*console.log("Steps", StepsInfo, StepsInfo.toString("utf8"))
      console.log('  Steps : ' + a);
      console.log('  Meters : ' + b);
      console.log('  Callories : ' + c);*/
      let dataSend = {
        status: true,
        exec: "Steps",
        data: {
          steps: a,
          meters: b,
          callories: c
        }
      };
      let dataSave = [{
        id: self.pacientId + "-" + self.macAddress,
        bio: true,
        board_id: self.boardId,
        sensor_id: self.sensors["steps"].id,
        transducer: self.sensors["steps"].tag,
        measure: self.sensors["steps"].measure,
        datetime: new Date(),
        value: a
      }, {
        id: self.pacientId + "-" + self.macAddress,
        bio: true,
        board_id: self.boardId,
        sensor_id: self.sensors["meters"].id,
        transducer: self.sensors["meters"].tag,
        measure: self.sensors["meters"].measure,
        datetime: new Date(),
        value: b
      }, {
        id: self.pacientId + "-" + self.macAddress,
        bio: true,
        board_id: self.boardId,
        sensor_id: self.sensors["calories"].id,
        transducer: self.sensors["calories"].tag,
        measure: self.sensors["calories"].measure,
        datetime: new Date(),
        value: c
      }];
      utilsBle.sendMsgSaveData(dataSave);
      utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);
      if (others.length > 0) {
        let optsArray = others.pop();
        self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
      } else {
        utilsBle.nobleDeviceDisConnect(device);
      }
    }
  });

}

BleServer.prototype.bandfitnessHeartRate = function (device, service, characteristic, others) {
  var self = this;
  //contador de medições de pulsação
  var contHR = 1;
  var sumHR = 0;
  utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function (descriptor) {
    console.log(' Enabling Heart Rate notifications status... ');
    var hr_notifications = utilsBle.dataCommand([0x01, 0x00]);
    //ativar notificações para a pulsação
    utilsBle.nonleDescriptorWriteCommand(descriptor, hr_notifications, function () {
      sleep.sleep(2);
      //procura caracteristica para iniciar processo de leitura da pulsação
      utilsBle.nobleDeviceReturnCaract(service, '2a39', function (heartratecontrolcaracteristic) {
        //comando para iniciar processo de leitura contínuo para a pulsação
        var start_Heart_Rate = utilsBle.dataCommand([0x15, 0x01, 0x01]);

        utilsBle.sendMsgCommand(true, "bleMsg", "Inicio da leitura da pulsação.", false);
        utilsBle.nobleCaracteristicWrite(heartratecontrolcaracteristic, start_Heart_Rate, false, function () {
          //ativar processo de receber notificações
          //heartratemeasurementcaracteristic.notify(true, function (error) {});
          //verifica se recebe alguma notificação
          characteristic.on('data', function (data, isNotification) {
            clearTimeout(noDevice);
            var val = (data.readInt8(0) + data.readInt8(1)) * 1
            sumHR += val
            if (data && isNotification) {
              console.log(' HEART RATE ' + (contHR++) + ' : ' + val);
              let dataSend = {
                status: true,
                exec: "heartrate",
                data: {
                  heartrate: data.readInt8(0) + data.readInt8(1)
                }
              };
              utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);

              //não recebeu nada
            } else {
              console.log(' Hear Rate error, cant help! Response:  ' + data.toString("hex"));
              /**
               * TODO: Desliga o equipamento
               */
              utilsBle.nobleDeviceDisConnect(device);
            }
            noDevice = setTimeout(function () {
              let hrateCals = Math.round(sumHR / (contHR - 1));
              hrateCals = Math.round(hrateCals);
              console.log(' HEART RATE ' + hrateCals);
              utilsBle.sendMsgCommand(true, "bleMsg", "Processo concluido.", false);
              let dataSend = {
                status: true,
                exec: "heartrateEnd",
                data: {
                  heartrateavg: (hrateCals > 0 ? hrateCals : 0)
                }
              };
              utilsBle.sendMsgCommand(true, "bleExecFimBandFitness", dataSend, false);
              let dataSave = [{
                id: self.pacientId + "-" + self.macAddress,
                bio: true,
                board_id: self.boardId,
                sensor_id: self.sensors["heartrate"].id,
                transducer: self.sensors["heartrate"].tag,
                measure: self.sensors["heartrate"].measure,
                datetime: new Date(),
                value: (hrateCals > 0 ? hrateCals : 0)
              }]
              utilsBle.sendMsgSaveData(dataSave);
              if (others.length > 0) {
                let optsArray = others.pop();
                self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
              } else {
                utilsBle.nobleDeviceDisConnect(device);
              }
            }, 10000);
          });
        });

      });
    });
  });
}

BleServer.prototype.bandfitnessCaloriesDisplay = function (device, service, characteristic, others) {
  var self = this;
  utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function (descriptor) {
    var hr_notifications = utilsBle.dataCommand([0x01, 0x00]);
    //ativar notificações para a pulsação
    utilsBle.nonleDescriptorWriteCommand(descriptor, hr_notifications, function () {
      var display_distance = utilsBle.dataCommand([0x0a, 0x08, 0x00, 0x00, 0x01]);
      //ativar notificações para a pulsação
      utilsBle.nobleCaracteristicWrite(characteristic, display_distance, true, function () {
        characteristic.on('data', function (data, isNotification) {
          var aux = new Buffer([]);
          if (data && isNotification) {
            var hr_notifications = utilsBle.dataCommand([0x00, 0x00]);
            utilsBle.nonleDescriptorWriteCommand(descriptor, hr_notifications, function () {
              // console.log("Ok");
              if (others.length > 0) {
                let optsArray = others.pop();
                self.deviceDefaultDiscover(device, optsArray.opts, optsArray.nextExec, others);
              } else {
                utilsBle.nobleDeviceDisConnect(device);
              }
            });
          }
          if (data != aux) {
            return console.log(' Setting error, cant help! Response:  ' + data.toString("hex"));
          } else {
            return console.log('Couldn´t set calories Display');
          }

        });
      });
    });
  });
}

/**
 * TODO: recebe por parametro no proceso as definições configuradas para o funcionamento do Bluetooth
 */
process.on("message", function (data) {
  var srvble = new BleServer(data.serverdata);
  srvble.start();
});

module.exports = BleServer;