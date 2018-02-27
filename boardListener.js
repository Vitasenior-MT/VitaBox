var bodyParser = require('body-parser'),
    config = require('./config.js').ServerBoardListenerConfigs,
    dgram = require('dgram'),
    http = require('http'),
    server = dgram.createSocket('udp6');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
    let jsonO = JSON.parse((message + "").replace(new RegExp("'", 'g'), '\"'));
    console.log('----> ', jsonO);

    var data = {
        id: remote.address,
        sensores: [
            {
                sensortype: 'temp',
                sensorvalue: jsonO.MOTE.temp
            },
            {
                sensortype: 'co2',
                sensorvalue: jsonO.MOTE.co2
            },
            {
                sensortype: 'humi',
                sensorvalue: jsonO.MOTE.humi
            }
        ],
        local: 'WC'
    };

    console.log('-----> ', data);
    var jsonObject = JSON.stringify(data);
    console.log('-----> ', jsonObject);

    var options = {
        host: config.remoteserver,
        port: config.remoteport,
        path: '/api/sensor',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject)
        }
    };

    console.log('-----> ', options);
    try {
        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            res.setEncoding('utf8');
            var responseString = '';
            res.on('data', function (data) {
                responseString += data;
            });
            res.on('end', function () {
                console.log("Receive - ", responseString);
            });
        });
        req.write(jsonObject);
        req.end();
        req.on('error', function (e) {
            console.error("Error -> ", e);
        });
    } catch (e) {
        console.log("Erro ao tentar ligar ao servidor remoto!!!", e)
    }
});

server.bind(config.port, config.host);