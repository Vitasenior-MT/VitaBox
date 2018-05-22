'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http'),
	sbl = null;

var ServerBoardListener = function () {
	this.server = dgram.createSocket('udp6');
	this.sensor_type_list = null;
}

ServerBoardListener.prototype.start = function (config, sensor_type_list) {
	this.sensor_type_list = sensor_type_list;
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
		var data = {
			count: jsonO.MOTE.cont,
			node_id: nodeid,
			datetime: Date.now(),
			data: []
		};
		console.log('sensor_type_list: ');
		console.log(self.sensor_type_list);
		for (var index = 0; index < self.sensor_type_list.length; index++) {
			if (jsonO.MOTE[self.sensor_type_list[index]]) {
				data.data.push({
					sensortype: self.sensor_type_list[index],
					value: jsonO.MOTE[self.sensor_type_list[index]]
				});
			}
		}

		process.send({ sensorData: data });
	});

	this.server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	this.server.bind(config.port, config.host);
}

ServerBoardListener.prototype.updateList = function (sensor_type_list) {
	this.sensor_type_list = sensor_type_list;
}

module.exports = ServerBoardListener;

process.on("message", function (data) {
	if (data.sensor_type_list_update) {
		sbl.updateList(data.sensor_type_list_update);
	} else {
		console.log(data.sensor_type_list);
		console.log(data.sensor_type_list);
		console.log(data.sensor_type_list);
		console.log(data.sensor_type_list);
		sbl = new ServerBoardListener();
		sbl.start(data.configsListener, data.sensor_type_list);
	}
});