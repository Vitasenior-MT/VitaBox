'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http');

var ServerBoardListener = function () {
	this.server = dgram.createSocket('udp6');
	this.sensor_list = null;
}

ServerBoardListener.prototype.start = function (config) {
	var self = this;
	this.server.on('listening', function () {
		console.log('UDP ServerBoardListener listening on ' + self.server.address().address + ":" + self.server.address().port);
	});

	this.server.on('message', function (message, remote) {
		console.log(message, remote, config);
		console.log(remote.address + ':' + remote.port + ' - ' + message);
		let newMessage = message.toString().split('#');
		let jsonO = JSON.parse((newMessage[0]).replace(new RegExp("'", 'g'), '\"'));
		var nodeidRaw = remote.address.toString().split(":");
		var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');
		process.send({
			node_id: nodeid,
			datetime: Date.now(),
			data: jsonO.MOTE
		});
	});

	this.server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	this.server.bind(config.port, config.host);
}

module.exports = ServerBoardListener;

process.on("message", function (data) {
	var sbl = new ServerBoardListener();
	sbl.start(data.configsListener);
});