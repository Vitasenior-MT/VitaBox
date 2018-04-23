'use strict'
require('colors');
var noble = require('noble'),
  sleep = require('sleep'),
  cp = require('child_process'),
  noDeviceCon = null,
  timeDisconnect = 10;

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

  nobleDetectDeviceAndConnect: function(bleId, callback) {
    try {
      noble.on('discover', function(peripheral) {
        console.log("start discover");
        if (peripheral.address === bleId) {
          noble.stopScanning();
          console.log('peripheral with Address ' + peripheral.address + ' found');
          self.sendMsgCommand(true, "bleMsg", "Dispositivo encontrado.", false);
          // TODO: Socket send detected.
          peripheral.connect(function(error) {
            if (error) {
              console.log("error", error.toString());
              self.sendErrorCommand();
            }
            self.sendMsgCommand(true, "bleMsg", "Dispositivo conectado.", false);
            console.log("Connected");
            callback(peripheral);
          });
        }
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
    }
  },

  nobleDeviceReturnService: function(peripheral, serviceUid, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function() {
      self.sendMsgCommand(false, "bleMsg", "Erro no dispositivo. Tente novamente.", true)
    }, 1000 * timeDisconnect);
    try {
      peripheral.discoverServices(serviceUid, function(err, services) {
        if (err) {
          console.log("Error", err.toString());
          self.sendErrorCommand();
        }
        callback(services[0]);
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
    }
  },

  nobleDeviceReturnCaract: function(service, caractUid, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function() {
      self.sendMsgCommand(false, "bleMsg", "Erro no dispositivo. Tente novamente.", true)
    }, 1000 * timeDisconnect);
    try {
      service.discoverCharacteristics(caractUid, function(err, characteristics) {
        if (err) {
          console.log("Error", err.toString());
          self.sendErrorCommand();
        }
        callback(characteristics[0]);
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
    }
  },

  nobleDeviceReturnDiscriptor: function(caract, descriptUid, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function() {
      self.sendMsgCommand(false, "bleMsg", "Erro no dispositivo. Tente novamente.", true)
    }, 1000 * timeDisconnect);
    try {
      caract.discoverDescriptors(function(err, descriptors) {
        if (err) {
          console.log("Error", err.toString());
          self.sendErrorCommand();
        }
        descriptors.forEach(function(descriptor) {
          if (descriptor.uuid == descriptUid) {
            callback(descriptor);
          }
        });
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
    }
  },

  nobleCaracteristicWrite: function(caracteristic, command, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function() {
      self.sendMsgCommand(false, "bleMsg", "Erro no dispositivo. Tente novamente.", true)
    }, 1000 * timeDisconnect);
    try {
      caracteristic.write(new Buffer(command), true, function(err, data) {
        if (err) {
          console.log("Error", err.toString());
          self.sendErrorCommand();
        }
        callback();
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
    }
  },

  nobleCaracteristicRead: function(caracteristic, callback) {
    clearTimeout(noDeviceCon);
    try {
      caracteristic.read(function(err, data) {
        if (err) {
          console.log("Error", err.toString());
          self.sendErrorCommand();
        }
        callback(data);
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
    }
  },
  nonleDescriptorWriteCommand: function(descriptor, command, callback) {
    clearTimeout(noDeviceCon);
    noDeviceCon = setTimeout(function() {
      self.sendMsgCommand(false, "bleMsg", "Erro no dispositivo. Tente novamente.", true)
    }, 1000 * timeDisconnect);
    try {
      descriptor.writeValue(new Buffer(command), function(err) {
        if (err) {
          console.log("Error", err.toString());
          self.sendErrorCommand();
        }
        callback();
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
    }
  },

  nobleDeviceDisConnect: function(peripheral) {
    clearTimeout(noDeviceCon);
    try {
      peripheral.disconnect(function(err, data) {
        if (err) {
          console.log("Error", err.toString());
          self.sendErrorCommand();
        }
        console.log("Disconnected from peripheral.");
        self.sendMsgCommand(false, "bleMsg", "Dispositivo desligado.", true);
      });
    } catch (e) {
      console.log("Error", e.toString());
      self.sendErrorCommand();
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
        satus: status,
        data: msg
      }}
    self.sendMsgToParentProc("bluetooth", dataSend, close);
  },
  /**
   * TODO: 
   */
  sendMsgSaveData: function(data) {
    self.sendMsgToParentProc("saveData", data, false);
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

  dataCommand: function(attr) {
    var command = [];
    for (let index = 0; index < attr.length; index++) {
      command.push(attr[index]);
    }
    return command;
  }
}