'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var dgram = require('dgram'),
	mode = process.env.NODE_ENV || "DEV",
  	config = require('./../config-' + mode.toLowerCase() + '/config.js').ServerBoardWarningConfigs;

var ServerBoardListener = function () {
	this.server = dgram.createSocket('udp6');
}

ServerBoardListener.prototype.start = function () {
	var self = this;
	this.server.on('listening', function () {
		successlog.info(`UDP ServerBoardWarning listening on: ${self.server.address().address} : ${self.server.address().port}`);
	});

	this.server.on('message', function (message, remote) {
		successlog.info(`Warning ADDRESS ---- ${remote} -- ${message}`);
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
	});

	this.server.on('error', (err) => {
		errorLog.error(`Error -> ${err}`);
	});
	
	this.server.bind(config.port, config.host);
}

module.exports = ServerBoardListener;

process.on("message", function () {
	new ServerBoardListener().start();
});