'use strict'
require('colors');
var sleep = require('sleep'),
    utilsBle = require('./bleUtils.js');

var BleServer = function(data){
    console.log("data", data);
    this.sktcon = data.skt;
    this.options = data.options;
    this.macAddress = data.macAddress;
    console.log("Ble", this.macAddress);
    var self = this;
    switch (data.action) {
        case "bloodPressure":
            self.bloodPressure();
            break;
        case "bodytemperature":
            self.bodytemperature();
            break;
        case "bodyPulse":
            self.bodyPulse();
            break;
    
        default:
            break;
    }
}

BleServer.prototype.bloodPressure = function(){
    console.log("run");    
    var self = this;
    utilsBle.nobleGetBleState(function(){ 
        utilsBle.nobleDetectDeviceAndConnect(self.macAddress, function(device) {
            sleep.sleep(2);
            /**
             * TODO: Descoberta do serviço destinado a iniciar o processo de medição da pressão arterial
             */
            utilsBle.nobleDeviceReturnService(device, ["ffe0"], function(service){
                sleep.sleep(4);
                /**
                 * TODO: Descobeta da caracteristica destinada a iniciar o processo de medição 
                 */
                utilsBle.nobleDeviceReturnCaract(service, ["ffe1"], function(characteristic){
                    /**
                     * TODO: Criação do comando para iniciar o processo
                     */
                    let command = utilsBle.createCommand(18, ["e".charCodeAt(0)]);
                    /**
                     * TODO: Envio do comando para inicio do processo
                     */
                    utilsBle.nobleCaracteristicWrite(characteristic, command, function(){
                        /**
                         * TODO: Leitura dos dados disponibilizados pelo equipamento
                         */
                        utilsBle.nobleCaracteristicRead(characteristic, function(){
                            /**
                             * TODO: Inicia a leitura dos dados disponibilizados pelo equipamento
                             */
                            characteristic.on('read', function (data, isNotification) {
                                process.send({
                                    proc: "bluetooth",
                                    sktTag: "bleExec", 
                                    sktData: {
                                            satus: true,
                                            data: data.toString("utf8")     
                                        }
                                    }
                                );
                                console.log("Data:", data.toString("utf8"));
                                if (isNotification === true && data.toString("utf8").charAt(0) === "g") {
                                    //console.log("TesteFim", data.toString("utf8"), isNotification);
                                    process.send({
                                        proc: "bluetooth",
                                        sktTag: "bleExecFimPress", 
                                        sktData: {
                                                satus: true,
                                                data: data.toString("utf8")
                                            }
                                        }
                                    );
                                    var result = data.toString("utf8");
                                    var results = result.split('/');
                                    console.log("Systolic: ", (results[1] * 1));
                                    console.log("Diastolic: ", (results[2] * 1));
                                    console.log("Pulse/min: ", (results[3] * 1));
                                                                            
                                    sleep.sleep(1);
                                    /**
                                     * TODO: Criação do comando para desligar o equipamento
                                     */
                                    let command2 = utilsBle.createCommand(18, ["i".charCodeAt(0)]);
                                    /**
                                     * TODO: Envio do comando para desligar o equipamento 
                                     */
                                    utilsBle.nobleCaracteristicWrite(characteristic, command2,  function(){
                                        sleep.sleep(1);
                                        /**
                                         * TODO: Desconectar o periférico
                                         */
                                        utilsBle.nobleDeviceDisConnect(device);
                                    });   
                                } else if (data.toString("utf8").charAt(0) === "g") {
                                    process.send({
                                        proc: "bluetooth",
                                        sktTag: "bleExecFim", 
                                        sktData: {
                                                satus: false,
                                                data: data.toString("utf8")
                                            }
                                        }
                                    );          
                                    sleep.sleep(1);
                                    /**
                                     * TODO: Criação do comando para desligar o equipamento
                                     */
                                    let command2 = utilsBle.createCommand(18, ["i".charCodeAt(0)]);
                                    /**
                                     * TODO: Envio do comando para desligar o equipamento 
                                     */
                                    utilsBle.nobleCaracteristicWrite(characteristic, command2,  function(){
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
                });
            });
        });
    });
}

BleServer.prototype.bodytemperature = function(){
    var self = this;
    utilsBle.nobleGetBleState(function(){        
        utilsBle.nobleDetectDeviceAndConnect(self.macAddress, function(device) {                
            utilsBle.nobleDeviceReturnService(device, ["180f"], function(service){
                utilsBle.nobleDeviceReturnCaract(service, ["2a19"], function(characteristic){
                    utilsBle.nobleCaracteristicRead(characteristic, function(data){  
                        if (data) {
                            console.log('  Battery level : ' + data[0] + '%');
                            process.send({
                                proc: "bluetooth",
                                sktTag: "bleMsgBattery", 
                                sktData: {
                                        satus: true,
                                        data: data[0]
                                    }
                                }
                            );
                            sleep.sleep(1);
                            utilsBle.nobleDeviceReturnService(device, ["1809"], function(service){
                                utilsBle.nobleDeviceReturnCaract(service, ["2a1e"], function(characteristic){
                                    utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function(descriptor){
                                        console.log(' Enabling Body Temperature notifications status... ');
                                        let command = utilsBle.dataCommand([0x01, 0x00]);
                                        
                                        utilsBle.nonleDescriptorWriteCommand(descriptor, command, function(){
                                            sleep.sleep(4);
                                            utilsBle.nobleCaracteristicRead(characteristic, function(){
                                                characteristic.on('read', function (data, isNotification) {
                                                    //console.log(isNotification, JSON.stringify(data, null, 2));
                                                    //recebeu algo
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
                                                        console.log("Body Temperature: " + temp + "ºC");
                                                        process.send({
                                                            proc: "bluetooth",
                                                            sktTag: "bleExecFimTemp", 
                                                            sktData: {
                                                                    satus: true,
                                                                    data: temp
                                                                }
                                                            }
                                                        );
                                                        sleep.sleep(1);
                                                        utilsBle.nobleDeviceDisConnect(device);
                                                    } else {
                                                        //não recebeu nada
                                                        console.log(' Body Temperature error, cant help! Response:  ' + data.toString("hex"));
                                                        process.send({
                                                            proc: "bluetooth",
                                                            sktTag: "bleExecFimTemp", 
                                                            sktData: {
                                                                    satus: false,
                                                                    data: data.toString("utf8")
                                                                }
                                                            }
                                                        );
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
                });
            });
        });
    });
}

BleServer.prototype.bodyPulse = function(){
    var self = this;
    utilsBle.nobleGetBleState(function(){ 
        utilsBle.nobleDetectDeviceAndConnect(self.macAddress, function(device) {                
            utilsBle.nobleDeviceReturnService(device, ["49535343fe7d4ae58fa99fafd205e455"], function(service){
                utilsBle.nobleDeviceReturnCaract(service, ["495353431e4d4bd9ba6123c647249616"], function(characteristic){
                    utilsBle.nobleDeviceReturnDiscriptor(characteristic, '2902', function(descriptor){
                        console.log(' Enabling Pulsiometer notifications status... ');
                        let command = utilsBle.dataCommand([0x01]);
                        
                        utilsBle.nonleDescriptorWriteCommand(descriptor, command, function(){
                            sleep.sleep(5);

                            utilsBle.nobleCaracteristicRead(characteristic, function(){
                                characteristic.on('read', function (data, isNotification) {
                                    //console.log(isNotification, JSON.stringify(data, null, 2));
                                    //recebeu algo
                                    if (data && isNotification) {
                                            //console.log(JSON.stringify(data, null, 2));
                                        var pulse_spo2 = data.readInt8(3);
                                        var spo2 = data.readInt8(4);
                                        console.log("SpO2: " + spo2 + "%");
                                        console.log("Pulse: " + pulse_spo2 + "ppm");
                                        console.log(' Disabling Pulsiometer notifications status... ');
                                        process.send({
                                            proc: "bluetooth",
                                            sktTag: "bleExecFimPulse", 
                                            sktData: {
                                                    satus: true,
                                                    data: data.toString("utf8")
                                                }
                                            }
                                        );
                                        //sleep.sleep(1);
                                        let command = utilsBle.dataCommand([0x00]);    
                                        utilsBle.nonleDescriptorWriteCommand(descriptor, command, function(){
                                            utilsBle.nobleDeviceDisConnect(device);
                                        });
                                    } else {
                                        //não recebeu nada
                                        console.log(' Pulsiometer error, cant help! Response:  ' + data.toString("hex"));
                                        process.send({
                                            proc: "bluetooth",
                                            sktTag: "bleExecFimPulse", 
                                            sktData: {
                                                    satus: false,
                                                    data: data.toString("utf8")
                                                }
                                            }
                                        );
                                        utilsBle.nobleDeviceDisConnect(device);
                                    }
                                });
                            });
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
process.on("message", function (data) {
	new BleServer(data.serverdata);
});

module.exports = BleServer;

/*
module.exports = {
    
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
    },

    bloodglucose: function(req, res) {
        var macAddress = '187a93090bc3'; 
        console.log("Ble", macAddress);
        res.json({
            status: true,
            data: "Start Operation."
        });
    },
}
*/