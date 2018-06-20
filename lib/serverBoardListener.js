'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var dgram = require('dgram');

var ServerBoardListener = function () {
	this.server = dgram.createSocket('udp6');
	this.sensor_list = null;
}

ServerBoardListener.prototype.start = function (config) {
	var self = this;
	this.server.on('listening', function () {
		successlog.info(`UDP ServerBoardRegister listening on: ${self.server.address().address} : ${self.server.address().port}`);
	});

	this.server.on('message', function (message, remote) {
		successlog.info(`Listener ADDRESS ---- ${remote.address} : ${remote.port} -- NODE TO ADD -- ${message}`);
		let newMessage = message.toString().split('#');
		let jsonO = JSON.parse((newMessage[0]).replace(new RegExp("'", 'g'), '\"'));
		var nodeidRaw = remote.address.toString().split(":");
		var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');
		if (jsonO.WARNING) {
			process.send({
				warning: true,
				node_id: nodeid,
				datetime: Date.now(),
				data: jsonO.WARNING
			});
		} else {
			process.send({
				warning: false,
				node_id: nodeid,
				datetime: Date.now(),
				data: jsonO.MOTE
			});
		}
	});

	this.server.on('error', (err) => {
		errorLog.error(`Error -> ${err}`);
	});

	this.server.bind(config.port, config.host);
}

module.exports = ServerBoardListener;

process.on("message", function (data) {
	new ServerBoardListener().start(data.configsListener);
});