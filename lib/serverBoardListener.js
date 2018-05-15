'use strict'
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http');

var ServerBoardListener = function () {
	this.server = dgram.createSocket('udp6');
}

ServerBoardListener.prototype.start = function (config, sensor_type_list) {
	var self = this;
	this.server.on('listening', function () {
		console.log('UDP ServerBoardListener listening on ' + self.server.address().address + ":" + self.server.address().port);
	});

	this.server.on('message', function (message, remote) {
		console.log(message, remote, config);
		console.log(remote.address + ':' + remote.port + ' - ' + message);
		let newMessage = message.toString().split('#');
		let jsonO = JSON.parse((newMessage[0]).replace(new RegExp("'", 'g'), '\"'));
		console.log('----> ', jsonO);
		var nodeidRaw = remote.address.toString().split(":");
		console.log('----> ', nodeidRaw);
		var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');
		var data = {
			count: jsonO.MOTE.cont,
			node_id: nodeid,
			datetime: Date.now(),
			data: []
		};

		for (var index = 0; index < sensor_type_list.length; index++) {
			data.data.push({
				sensortype: sensor_type_list[index],
				value: jsonO.MOTE[sensor_type_list[index]]
			});
		}
		
		process.send({ sensorData: data });
	});

	this.server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	this.server.bind(config.port, config.host);
}

module.exports = ServerBoardListener;

process.on("message", function (data) {
	let sbl = new ServerBoardListener();
	sbl.start(data.configsListener, data.sensor_type_list);
});