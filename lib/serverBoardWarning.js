'use strict'
var dgram = require('dgram'),
	sbr = null,
	logger = require('./logger'),
	errorLog = logger.errorlog,
	successlog = logger.successlog,
	sensorlib = require('./sensorlib.js'),
	mode = process.env.NODE_ENV || "DEV",
	config = require('./../config-' + mode.toLowerCase() + '/config.js').ServerBoardWarningConfigs;

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
		if (message.split('#')[1] === 'confirmed') {
			console.log('Thredhold Updated')
		} else {
			let newMessage = message.toString().split('#');
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

ServerBoardWarnings.prototype.sendData = function (data) {
	var self = this;
	/*sensors.getThresholds({ location: '', sensortype: '' }, () => {
		this.server.send(message, 0, message.length, config.port, config.host, function (err, bytes) {
			if (err) throw console.log('UDP ERROR');
			console.log('UDP message sent to ' + config.host + ':' + config.port);
		});
	});*/
	for (var index in data) {
		console.log('-------------------------> ', data[index]);
		let message = data[index].sensortype + '_max:' + '1' + '#confirmed';
		this.server.send(message, 0, message.length, config.port, config.host, function (err, bytes) {
			if (err) throw console.log('UDP ERROR');
			console.log('UDP message sent to ' + config.host + ':' + config.port + ' with message: ' + message);
		});
		let message01 = data[index].sensortype + '_min:' + data[index].threshold_min_acceptable + '#confirmed';
		this.server.send(message01, 0, message01.length, config.port, config.host, function (err, bytes) {
			if (err) throw console.log('UDP ERROR');
			console.log('UDP message sent to ' + config.host + ':' + config.port + ' with message: ' + message01);
		});
	}
}

module.exports = ServerBoardWarnings;

process.on("message", function (data) {
	if (data.thresholds) {
		sbr.sendData(data.thresholds);
	} else {
		sbr = new ServerBoardWarnings();
		sbr.start();
	}
});