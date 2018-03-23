'use strict'
var bodyParser = require('body-parser'),
	dgram = require('dgram'),
	http = require('http'),
	server = dgram.createSocket('udp6');

var ServerBoardListener = function (config) {
	server.on('listening', function () {
		var address = server.address();
		console.log('UDP ServerBoardListener listening on ' + address.address + ":" + address.port);
		console.log("\n");
	});

	server.on('message', function (message, remote) {
		processing(message, remote, config.remote);
	});

	server.on('error', (err) => {
		console.log('Error -> ', err);
	});

	server.bind(config.server.port, config.server.host);
}

var processing = function (message, remote, config) {
	console.log(remote.address + ':' + remote.port + ' - ' + message);
	let newMessage = message.toString().split('#');
	let jsonO = JSON.parse((newMessage[0]).replace(new RegExp("'", 'g'), '\"'));
	console.log('----> ', jsonO);
	var aux = remote.address.toString().split(":");
	var nodeid = aux[aux.length - 1];
	nodeid = nodeid.replace("\"", "");

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

	console.log('-----> ', data);
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
	}
}

module.exports = ServerBoardListener;
