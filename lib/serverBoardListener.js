'use strict'
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http');

var ServerBoardListener = function () {
	this.server = dgram.createSocket('udp6');
}

ServerBoardListener.prototype.start = function (config) {
	var self = this;
	this.server.on('listening', function () {
		console.log('UDP ServerBoardListener listening on ' + self.server.address().address + ":" + self.server.address().port);
	});

	this.server.on('message', function (message, remote) {
		self.processing(message, remote, config.remote);
	});

	this.server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	this.server.bind(config.port, config.host);
}

ServerBoardListener.prototype.processing = function (message, remote, config) {
	console.log(remote.address + ':' + remote.port + ' - ' + message);
	let newMessage = message.toString().split('#');
	let jsonO = JSON.parse((newMessage[0]).replace(new RegExp("'", 'g'), '\"'));
	console.log('----> ', jsonO);
	var nodeidRaw = message.toString().split(":");
	var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');

	var data = {
		node_id: nodeid,
		sensores: [
			{
				sensortype: 'temp',
				sensorvalue: jsonO.MOTE.temp
			},
			{
				sensortype: 'co2',
				sensorvalue: jsonO.MOTE.co2
			},
			{
				sensortype: 'humi',
				sensorvalue: jsonO.MOTE.humi
			}
		]
	};
	
	process.send({ sensorData: data });

	/*console.log('-----> ', data);
	var jsonObject = JSON.stringify(data);
	console.log('-----> ', jsonObject);

	var options = {
		host: config.remoteserver,
		port: config.remoteport,
		path: '/api/sensor',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(jsonObject)
		}
	};

	console.log('-----> ', options);
	try {
		var req = http.request(options, function (res) {
			console.log('STATUS: ' + res.statusCode);
			res.setEncoding('utf8');
			var responseString = '';
			res.on('data', function (data) {
				responseString += data;
			});
			res.on('end', function () {
				console.log("Receive - ", responseString);
			});
		});
		req.write(jsonObject);
		req.end();
		req.on('error', function (e) {
			console.error("Error -> ", e);
		});
	} catch (e) {
		console.log("Erro ao tentar ligar ao servidor remoto!!!", e)
	}*/
}

module.exports = ServerBoardListener;

process.on("message", function (data) {
	let sbl = new ServerBoardListener();
	sbl.start(data.configsListener);
});