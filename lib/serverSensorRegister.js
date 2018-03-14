'use strict'
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http'),
	server = dgram.createSocket('udp6');

var ServerSensorRegister = function (config) {
	server.on('listening', function () {
		var address = server.address();
		console.log('UDP Server listening on ' + address.address + ":" + address.port);
		console.log("\n");
	});

	// Log any errors connected to the db
	db.connect(function (err) {
		if (err) console.log(err)
		console.log("\n");
	})


	server.on('message', function (message, remote) {
		console.log("BR ADDRESS ---- " + remote.address + ':' + remote.port + ' -- NODE TO ADD -- ' + message);
		var aux = message.toString().split(":");
		var nodeid = aux[aux.length - 1];
		console.log('NODEID TO SEARCH ----' + nodeid);
		db.query("SELECT * FROM nodes WHERE node LIKE '" + nodeid.toString() + "'", function (err, result, response) {
			if (err) {
				console.log('Count Error :' + err);
			} if (result) {
				console.log("****NODE FOUND****");
				var message1 = "flag1";
				server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
					if (err) throw err;
					console.log('NODE ACCEPTED ---- ' + message);
					console.log('FLAG SENT ---- ' + message1);
					console.log("\n");
				});
			} else {
				console.log("****NODE NOT VALID****");
				var message1 = "flag2";
				server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
					if (err) throw err;
					console.log('NODE DECLINED ---- ' + message);
					console.log('FLAG SENT ---- ' + message1);
					console.log("\n");
				});
			}
		});

	});

	server.bind(PORT, HOST);

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
