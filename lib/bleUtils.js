'use strict'
require('colors');
var noble = require('noble'),
  sleep = require('sleep'),
  cp = require('child_process'),
  noDeviceCon = null,
  timeDisconnect = 60;

var self = module.exports = {
  nobleGetBleState: function(callback) {
    noble.on('stateChange', function(state) {
      if (state === 'poweredOn') {
        console.log("start scaning");
        noble.startScanning();
        self.sendMsgCommand(true, "bleMsg", "Dispositivo Bluetooth ligado. Inicio da pesquisa.", false);
        callback();
      } else {
        console.log("stop scaning");
        noble.stopScanning();
        self.sendMsgCommand(false, "bleMsg", "Dispositivo Bluetooth desligado.", true);
      }
    });
  },
  /**
   * TODO:
   */
  nobleDetectDeviceAndConnect: function(bleId, callback) {
    try {
      noble.on('discover', function(peripheral) {
        console.log("start discover");
        console.log('mac address ' + peripheral.address);
        if (peripheral.address === bleId) {
          noble.stopScanning();
          console.log('peripheral with Address ' + peripheral.address + ' found');
          self.sendMsgCommand(true, "bleMsg", "Dispositivo encontrado.", false);
          // TODO: Socket send detected.
          peripheral.connect(function(error) {
            if (error) {
              console.log("error", error.toString());
              return self.sendErrorCommand();
            }
            self.sendMsgCommand(true, "bleMsg", "Dispositivo conectado.", false);
            console.log("Connected");
            callback(peripheral);
          });
        }
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO:
   */
  nobleDeviceReturnService: function(peripheral, serviceUid, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function() {
      self.sendErrorCommand();
    }, 1000 * timeDisconnect);
    try {
      peripheral.discoverServices(serviceUid, function(err, services) {
        if (err) {
          console.log("Error", err.toString());
          return self.sendErrorCommand();
        }
        callback(services[0]);
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO:
   */
  nobleDeviceReturnCaract: function(service, caractUid, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function () {
      self.sendErrorCommand();
    }, 1000 * timeDisconnect);
    try {
      service.discoverCharacteristics(caractUid, function(err, characteristics) {
        if (err) {
          console.log("Error", err.toString());
          return self.sendErrorCommand();
        }
        callback(characteristics[0]);
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO:
   */
  nobleDeviceReturnDiscriptor: function(caract, descriptUid, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function () {
      self.sendErrorCommand();
    }, 1000 * timeDisconnect);
    try {
      caract.discoverDescriptors(function(err, descriptors) {
        if (err) {
          console.log("Error", err.toString());
          return self.sendErrorCommand();
        }
        descriptors.forEach(function(descriptor) {
          if (descriptor.uuid == descriptUid) {
            callback(descriptor);
          }
        });
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO:
   */
  nobleCaracteristicWrite: function(caracteristic, command, flag, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function () {
      self.sendErrorCommand();
    }, 1000 * timeDisconnect);
    try {
      caracteristic.write(new Buffer(command), flag, function(err, data) {
        if (err) {
          console.log("Error", err.toString());
          return self.sendErrorCommand();
        }
        callback();
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO:
   */
  nobleCaracteristicRead: function (caracteristic, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function () {
      self.sendErrorCommand();
    }, 1000 * timeDisconnect);
    try {
      caracteristic.read(function(err, data) {
        if (err) {
          console.log("Error", err.toString());
          return self.sendErrorCommand();
        }
        callback(data);
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO:
   */
  nonleDescriptorWriteCommand: function (descriptor, command, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function () {
      self.sendErrorCommand();
    }, 1000 * timeDisconnect);
    try {
      descriptor.writeValue(new Buffer(command), function(err) {
        if (err) {
          console.log("Error", err.toString());
          return self.sendErrorCommand();
        }
        callback();
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO:
   */
  nobleDeviceDisConnect: function(peripheral) {
    clearTimeout(noDeviceCon);
    try {
      peripheral.disconnect(function(err, data) {
        if (err) {
          console.log("Error", err.toString());
          return self.sendErrorCommand();
        }
        console.log("Disconnected from peripheral.");
        self.sendMsgCommand(true, "bleMsg", {msg: "Dispositivo desligado.", enableApp: true}, true);
      });
    } catch (e) {
      console.log("Error", e.toString());
      return self.sendErrorCommand();
    }
  },
  /**
   * TODO: 
   */
  sendErrorCommand: function() {
    self.restartBleService();
    console.log("Erro send error.");
    self.sendMsgCommand(true, "bleError", "Erro no dispositivo. Tente novamente.", true);
  },
  /**
   * TODO: 
   */
  sendMsgCommandWarning: function(status, tag, msg) {
    self.sendMsgCommand(status, tag, msg, false);
  },
  /**
   * TODO: 
   */
  sendMsgCommand: function(status, tag, msg, close) {
    let dataSend = {
      sktTag: tag,
      sktData: {
        status: status,
        data: msg
      }}
    self.sendMsgToParentProc("bluetooth", dataSend, close);
  },
  /**
   * TODO: 
   */
  sendMsgSaveData: function(patientId, macddr, boardId, sensorsDb, newDataSensors, status, tag, close) {
    let data = [];
    let dataMsg = [];
    let keys = Object.keys(sensorsDb);
    console.log('-----> fase 0123 - 348ac41d', patientId)
    console.log('-----> fase 0123 - 348ac41d', macddr)
    console.log('-----> fase 0123 - 348ac41d', boardId)
    console.log('-----> fase 0123 - 348ac41d', sensorsDb)
    console.log('-----> fase 0123 - 348ac41d', newDataSensors)
    console.log('-----> fase 0123 - 348ac41d', status)
    console.log('-----> fase 0123 - 348ac41d', tag)
    console.log('-----> fase 0123 - 348ac41d - keys', keys)
    console.log('-----> fase 0123 - 348ac41d', keys[key])
    console.log('-----> fase 0123 - 348ac41d', newDataSensors[keys[key]])
    for (let key in keys) {
      if (newDataSensors[keys[key]] !== undefined) {
        let bleSnr = sensorsDb[keys[key]];
        data.push({
          id: patientId + "-" + macddr,
          patient_id: patientId,
          bio: true,
          board_id: boardId,
          sensor_id: bleSnr.id,
          transducer: bleSnr.tag,
          unit: bleSnr.unit,
          to_read: bleSnr.to_read,
          measure: bleSnr.measure,
          datetime: new Date(),
          value: newDataSensors[keys[key]]
        }); 
        dataMsg.push({         
          tag: bleSnr.tag,
          unit: bleSnr.unit,
          to_read: bleSnr.to_read,
          measure: bleSnr.measure,
          value: newDataSensors[keys[key]]
        }); 
      }     
    }
    console.log('-----> fase 03 - 348ac41d', data)
    console.log('-----> fase 04 - 348ac41d', dataMsg)
    // console.log("Res", dataMsg);
    self.sendMsgCommand(status, tag, dataMsg, close);
    self.sendMsgToParentProc("saveDataSensors", data, false);
  },
  /**
   * TODO: 
   */
  sendMsgToParentProc: function(proc, data, close) {
    process.send({
      proc: proc,
      dataSend: data
    });
    if (close) {
      self.exitProcess();
    }
  },
  /**
   * TODO: 
   */
  sendAuthFlagPatient: function(flahAuth, userId){
    let dtSend = {
      flag: flahAuth,
      user_id: userId
    }
    self.sendMsgToParentProc("saveAuthPatient", dtSend, false);
  },
  /**
   * TODO: 
   */
  restartBleService: function() {
    try {
      cp.execSync('sudo /etc/init.d/bluetooth restart');
    } catch (e) {
      console.log("Erro ao reiniciar o serviço Bluetooth.", e.toString());
    }
    console.log("Serviço bluetooth reiniciado.");
  },
  /**
   * TODO: 
   */
  exitProcess: function() {
    sleep.sleep(1);
    process.exit(0);
  },
  /**
   * TODO:
   */
  createCommand: function(atthandle, attr) {
    var command = [];
    command.push(0x00);
    command.push(Number((atthandle & parseInt("00FF", 16))).toString(16));
    command.push(Number((atthandle & parseInt("FF00", 16)) >> 8).toString(16));
    command.push(Number(attr.length).toString(16));
    for (let index = 0; index < attr.length; index++) {
      command.push(attr[index]);
    }
    return command;
  },
  /**
   * TODO:
   */
  dataCommand: function(attr) {
    var command = [];
    for (let index = 0; index < attr.length; index++) {
      command.push(attr[index]);
    }
    return command;
  }
}