'use strict'
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http'),
	sensorlib = require('./sensorlib.js'),
	timeoutCount = 0,
	timeoutCountMax = 3;

var ServerSensorRegister = function () {
	this.server = dgram.createSocket('udp6');
}

ServerSensorRegister.prototype.start = function (config) {
	var self = this;
	this.server.on('listening', function () {
		console.log('UDP ServerSensorRegister listening on ' + self.server.address().address + ":" + self.server.address().port);
	});

	this.server.on('message', function (message, remote) {
		console.log("BR ADDRESS ---- " + remote.address + ':' + remote.port + ' -- NODE TO ADD -- ' + message);
		var aux = message.toString().split(":");
		var nodeid = aux[aux.length - 1];
		nodeid = nodeid.replace("\"", "");
		console.log('NODEID TO SEARCH ----' + nodeid + '--');
		sensorlib.getByNodeId(nodeid, (err, result) => {
			if (err) {
				return console.log(err);
			}
			
			if (result) {
				var message1 = "flag1:" + nodeid;
				self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
					if (err) throw err;
					console.log('NODE ACCEPTED ---- ' + message);
					console.log('FLAG SENT ---- ' + message1);
					console.log("\n");
				});
			} else {
				var message1 = "flag2:" + nodeid;
				self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
					if (err) throw err;
					console.log('NODE DECLINED ---- ' + message);
					console.log('FLAG SENT ---- ' + message1);
					console.log("\n");
				});
			}
		});
	});

	this.server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	this.server.bind(config.server.port, config.server.host);
}

module.exports = ServerSensorRegister;
