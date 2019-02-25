'use strict'
var dgram = require('dgram'),
	sbr = null,
	logger = require('./logger'),
	errorLog = logger.errorlog,
	successlog = logger.successlog,
	sensorlib = require('./sensorlib.js'),
	IpTable = require('./models/iptables.js'),
	mode = process.env.NODE_ENV || "DEV",
	config = require('./../config-' + mode.toLowerCase() + '/config.js').ServerBoardWarningConfigs;

IpTable = new IpTable();

var ServerBoardWarnings = function () {
	this.server = dgram.createSocket('udp6');
}

ServerBoardWarnings.prototype.start = function () {
	var self = this;
	this.server.on('listening', function () {
		successlog.info(`UDP ServerBoardWarning listening on: ${self.server.address().address} : ${self.server.address().port}`);
	});

	this.server.on('message', function (message, remote) {
		successlog.info(`Warning ADDRESS ---- ${remote} -- ${message}`);
		let newMessage = message.toString().split('#');
		if (message.toString().match('CHANGED')) {
			console.log('Thredhold Updated')
		} else {
			let jsonO = JSON.parse((newMessage[0]).replace(new RegExp("'", 'g'), '\"'));
			var nodeidRaw = remote.address.toString().split(":");
			var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');
			console.log(nodeid)
			console.log(jsonO.WARNING)
			process.send({
				node_id: nodeid,
				data: jsonO.WARNING
			});
		}
	});

	this.server.on('error', (err) => {
		errorLog.error(`Error -> ${err}`);
	});

	this.server.bind(config.port, config.host);
}

ServerBoardWarnings.prototype.sendData = function (message, host) {
	this.server.send(message, 0, message.length, config.sendingHost, host, function (err, bytes) {
		if (err) throw console.log('UDP ERROR');
		console.log('UDP message sent to ' + host + ':' + config.sendingHost + ' with message: ' + message);
	});
}

module.exports = ServerBoardWarnings;

process.on("message", function (data) {
	if (data.host) {
		sbr.sendData(data.message, data.host);
	} else {
		sbr = new ServerBoardWarnings();
		sbr.start();
	}
});