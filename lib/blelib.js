var noble = require('noble'),
    sleep = require('sleep'),
    utilsBle = require('./bleUtils.js'),
    sktcon = null,
    BLE_GAP_ADDRESS_TYPE_PUBLIC = 0,
    conn_interval_min = 60,
    conn_interval_max = 76,
    timeout = 100,
    latency = 0,
    atthandle = 18,
    commandStart = ["e".charCodeAt(0)],
    commandPoweroFff = ["i".charCodeAt(0)];

module.exports = {
    addsktconn: function (skt) {
        sktcon = skt;
    },
    medirpressaoarterial: function (req, res) {
        let macAddress = '508cb16b174f';
        console.log("Ble", macAddress);
        res.json({
            status: true,
            data: "Start Operation."
        });

        noble.on('stateChange', function (state) {
            if (state === 'poweredOn') {
                console.log("start scaning");
                sktcon.sendMsgToPage("bleMsg", {
                    satus: true,
                    data: "Dispositivo Ble ligado. Inicio da pesquisa."
                });
                noble.startScanning();
            } else {
                console.log("stop scaning");
                sktcon.sendMsgToPage("bleMsg", {
                    satus: true,
                    data: "Dispositivo Ble desligado."
                });
                noble.stopScanning();
            }
        });

        noble.on('discover', function (peripheral) {
            console.log("start discover");
            if (peripheral.id === macAddress) {
                noble.stopScanning();
                console.log('peripheral with Address ' + peripheral.address + ' found');
                sktcon.sendMsgToPage("bleMsg", {
                    satus: true,
                    data: "Dispositivo encontrado."
                });
                // TODO: Socket send detected.
                peripheral.connect(function (error) {
                    if (error) {
                        sktcon.sendMsgToPage("bleError", {
                            satus: false,
                            data: error.toString()
                        });
                        return console.log("error", error.toString());
                    }
                    sktcon.sendMsgToPage("bleMsg", {
                        satus: true,
                        data: "Dispositivo conectado."
                    });
                    console.log("Connected");
                    // TODO: Socket send connectrd. ffe0
                    peripheral.discoverAllServicesAndCharacteristics(function (error, Services, characteristics) {
                        if (error) {
                            sktcon.sendMsgToPage("bleError", {
                                satus: false,
                                data: error.toString()
                            });
                            return console.log("error", error.toString());
                        }
                        var comCon = utilsBle.connectDirect(peripheral.address, BLE_GAP_ADDRESS_TYPE_PUBLIC, conn_interval_min, conn_interval_max, timeout, latency);

                        sktcon.sendMsgToPage("bleMsg", {
                            satus: true,
                            data: "A efetuar a ligação."     
                        });
                        sleep.sleep(2);
                        console.log("Conn", comCon.toString());
                        characteristics[1].write(new Buffer(comCon), true, function (err, data) {
                            if (err) {
                                sktcon.sendMsgToPage("bleError", {
                                    satus: false,
                                    data: err.toString()
                                });
                                return console.log("Error", err.toString());
                            }

                            sktcon.sendMsgToPage("bleMsg", {
                                satus: true,
                                data: "A enviar comando de inicio."     
                            });
                            var command = utilsBle.createCommand(atthandle, commandStart);
                            sleep.sleep(4);
                            console.log("write command", command);
                            characteristics[6].write(new Buffer(command), true, function (err, data) {
                                if (err) {
                                    sktcon.sendMsgToPage("bleError", {
                                        satus: false,
                                        data: err.toString()
                                    });
                                    return console.log("Error", err.toString());
                                }                                
                            });

                        });

                        characteristics[6].read(function (err, data) { });
                        characteristics[6].on('read', function (data, isNotification) {
                            sktcon.sendMsgToPage("bleExec", {
                                satus: true,
                                data: data.toString("utf8")     
                            });
                            //console.log("Data:", data.toString("utf8"));
                            if (isNotification === true && data.toString("utf8").charAt(0) === "g") {
                                //console.log("TesteFim", data.toString("utf8"), isNotification);
                                sktcon.sendMsgToPage("bleExecFim", {
                                    satus: true,
                                    data: data.toString("utf8")
                                });
                                var result = data.toString("utf8");
                                var results = result.split('/');
                                console.log("Systolic: ", (results[1] * 1));
                                console.log("Diastolic: ", (results[2] * 1));
                                console.log("Pulse/min: ", (results[3] * 1));
                                var command2 = utilsBle.createCommand(atthandle, commandPoweroFff);
                                sleep.sleep(1);
                                sktcon.sendMsgToPage("bleExec", {
                                    satus: true,
                                    data: "A enviar comando para desligar o equipamento."
                                });
                                console.log("write command", command2);
                                characteristics[6].write(new Buffer(command2), true, function (err, data) {
                                    if (err) {
                                        return console.log("Error", err.toString());
                                    }
                                });
                                console.log("Fim");
                                sleep.sleep(2);
                                peripheral.disconnect(function (err, data) {
                                    if (err) {
                                        return console.log("error", err.toString());
                                    }
                                    console.log("Disconnected from peripheral.");
                                });
                            }
                        }.bind(this));

                    });
                });
            }
        });
    }
}
