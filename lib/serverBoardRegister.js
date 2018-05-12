'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http'),
	sensorlib = require('./sensorlib.js'),
	timeoutCount = 0,
	timeoutCountMax = 3;

var ServerBoardRegister = function () {
	this.server = dgram.createSocket('udp6');
}

ServerBoardRegister.prototype.start = function (config, nodeIdList) {
	var self = this;
	this.server.on('listening', function () {
		successlog.info(`UDP ServerBoardRegister listening on: ${self.server.address().address} : ${self.server.address().port}`);
	});

	this.server.on('message', function (message, remote) {
		successlog.info(`BR ADDRESS ---- ${remote.address} : ${remote.port} -- NODE TO ADD -- message`);
		var nodeidRaw = message.toString().split(":");
		var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');
		successlog.info(`BR NodeID ---- ${nodeid}`);
		successlog.info(`BR NodeID ---- ${nodeIdList}`);
		if (nodeIdList.find(nodeid)) {
			var message1 = "flag1:" + nodeid;
			self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
				if (err) throw err;
				console.log('NODE ACCEPTED ---- ' + nodeid);
				console.log('FLAG SENT ---- ' + message1);
				console.log("\n");
			});
		} else {
			var message1 = "flag2:" + nodeid;
			self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
				if (err) throw err;
				console.log('NODE DECLINED ---- ' + nodeid);
				console.log('FLAG SENT ---- ' + message1);
				console.log("\n");
			});
		}
	});

	this.server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	this.server.bind(config.port, config.host);
}

module.exports = ServerBoardRegister;

Array.prototype.find = function (node_id) {
	var i = this.length;
	while (i--) {
		if (this[i] === node_id) {
			return true;
		}
	}
	return false;
}

process.on("message", function (data) {
	var sbr = new ServerBoardRegister();
	sbr.start(data.configsRegister, data.node_id_list);
});