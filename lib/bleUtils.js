'use strict'
require('colors');
var noble = require('noble');

module.exports = {
    nobleGetBleState: function(callback) {
        // console.log("nobleGetBleState");
        noble.on('stateChange', function (state) {
            if (state === 'poweredOn') {
                console.log("start scaning");
                noble.startScanning();
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                            satus: true,
                            data: "Dispositivo Ble ligado. Inicio da pesquisa."
                        }
                    }
                );
                callback();
            } else {
                console.log("stop scaning");                
                noble.stopScanning();
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData : {
                            satus: false,
                            data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            }
        });
    },

    nobleDetectDeviceAndConnect: function(bleId, callback) { 
        // console.log("nobleDetectDeviceAndConnect");
        noble.on('discover', function (peripheral) {
            console.log("start discover");
            if (peripheral.id === bleId) {
                noble.stopScanning();
                console.log('peripheral with Address ' + peripheral.address + ' found');
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                            satus: true,
                            data: "Dispositivo encontrado."
                        }
                    }
                );
                // TODO: Socket send detected.
                peripheral.connect(function (error) {
                    if (error) {
                        console.log("error", error.toString());
                        process.send({
                            proc: "bluetooth",
                            sktTag: "bleMsg", 
                            sktData: {
                                satus: false,
                                data: "Dispositivo Ble desligado."
                                }
                            }
                        );
                        return process.exit(0);
                    }
                    process.send({
                        proc: "bluetooth",
                        sktTag: "bleMsg", 
                        sktData: {
                                satus: true,
                                data: "Dispositivo conectado."
                            }
                        }
                    );
                    console.log("Connected");
                    callback(peripheral);
                });
            }
        });
    },

    nobleDeviceReturnService: function(peripheral, serviceUid, callback) {
        // console.log("nobleDeviceReturnService");
        peripheral.discoverServices(serviceUid, function (err, services) {
            if (err) {
                console.log("Error", err.toString());
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                        satus: false,
                        data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            }
            callback(services[0]);
        });
    },

    nobleDeviceReturnCaract: function(service, caractUid, callback){
        // console.log("nobleDeviceReturnCaract");
        service.discoverCharacteristics(caractUid, function (err, characteristics) {
            if (err) {
                console.log("Error", err.toString());
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    aktData: {
                        satus: false,
                        data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            }
            callback(characteristics[0]);
        });
    },

    nobleDeviceReturnDiscriptor: function (caract, descriptUid, callback) {
        caract.discoverDescriptors(function (err, descriptors) {
            if (err) {
                console.log("Error", err.toString());
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                        satus: false,
                        data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            }
            descriptors.forEach(function (descriptor) {
                if (descriptor.uuid == descriptUid) {
                    callback(descriptor);
                }
            });
        });
    },

    nobleCaracteristicWrite: function(caracteristic, command, callback){
        // console.log("nobleCaracteristicWrite");
        caracteristic.write(new Buffer(command), true, function (err, data) {
            if (err) {
                console.log("Error", err.toString());
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                        satus: false,
                        data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            }   
            callback();                             
        });
    },

    nobleCaracteristicRead: function(caracteristic, callback){
        // console.log("nobleCaracteristicRead");
        caracteristic.read(function (err, data) {
            if (err) {
                console.log("Error", err.toString());
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                        satus: false,
                        data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            }   
            callback(data);
         });
    },
    nonleDescriptorWriteCommand: function (descriptor, command, callback) {
        descriptor.writeValue(new Buffer(command), function(err) {
            if (err) {
                console.log("Error", err.toString());
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                        satus: false,
                        data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            }
            callback();
        });
    },

    nobleDeviceDisConnect: function(peripheral) {
        // console.log("nobleDeviceDisConnect");
        peripheral.disconnect(function (err, data) {
            if (err) {
                console.log("Error", err.toString());
                process.send({
                    proc: "bluetooth",
                    sktTag: "bleMsg", 
                    sktData: {
                        satus: false,
                        data: "Dispositivo Ble desligado."
                        }
                    }
                );
                return process.exit(0);
            } 
            console.log("Disconnected from peripheral.");
            
            process.send({
                proc: "bluetooth",
                sktTag: "bleExec", 
                sktData: {
                        satus: true,
                        data: "Dispositivo desligado."
                    }
                }
            );
            process.exit(0);
        });
    },

    createCommand: function (atthandle, attr) {
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
    dataCommand: function (attr) {
        var command = [];
        for (let index = 0; index < attr.length; index++) {
            command.push(attr[index]);
        }
        return command;
    }    
}