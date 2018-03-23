'use strict'
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http'),
	server = dgram.createSocket('udp6'),
	sensorlib = require('./sensorlib.js');

var ServerSensorRegister = function (config) {
	server.on('listening', function () {
		var address = server.address();
		console.log('UDP ServerSensorRegister listening on ' + address.address + ":" + address.port);
		console.log("\n");
	});

	server.on('message', function (message, remote) {
		console.log("BR ADDRESS ---- " + remote.address + ':' + remote.port + ' -- NODE TO ADD -- ' + message);
		var aux = message.toString().split(":");
		var nodeid = aux[aux.length - 1];
		nodeid = nodeid.replace("\"", "");
		console.log('NODEID TO SEARCH ----' + nodeid + '--');
		sensorlib.getByNodeId(nodeid, (err, result) => {
			if (err) {
				return console.log(err);
			}

			console.log(result);
			if (result.length >= 1) {
				var message1 = "flag1:" + nodeid;
				server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
					if (err) throw err;
					console.log('NODE ACCEPTED ---- ' + message);
					console.log('FLAG SENT ---- ' + message1);
					console.log("\n");
				});
			} else {
				var message1 = "flag2:" + nodeid;
				server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
					if (err) throw err;
					console.log('NODE DECLINED ---- ' + message);
					console.log('FLAG SENT ---- ' + message1);
					console.log("\n");
				});
			}
		});
	});

	server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	server.bind(config.server.port, config.server.host);
}


module.exports = ServerSensorRegister;










/*
var HOST = 'aaaa::212:4b00:60d:b21a';
var REMOTE_PORT = 5678;
var LOCAL_PORT  = 10000;

var dgram = require('dgram');
var message = new Buffer('O que vale é que o SCP já marcou senão ainda aqui estávamos!');
var client = dgram.createSocket('udp6');

client.bind(LOCAL_PORT);
client.send(message, 0, message.length, REMOTE_PORT, HOST,
  function(error, bytes) { 
    if (error) throw error;
    console.log('Message sent to host: "' + HOST + '", port: ' + REMOTE_PORT);
    client.close();
  } 
);
*/
