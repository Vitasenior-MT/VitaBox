'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

var coap = require('coap'),
	utils = require('./utils.js'),
	postControl = require('./postControl.js'),
	data = [],
	rawData = [],
	sensorData = [];

coap.registerFormat('application/json', 50);

var ServerBoardRegisterRevised = function () {
	this.list = [];
	this.count = 0;
}

ServerBoardRegisterRevised.prototype.start = function () {
	var self = this;
	setInterval(() => {
		self.process("fd00::212:4b00:14b5:d999", 'd999');
	}, utils.timeCalculator(0, 0, 1));
}

ServerBoardRegisterRevised.prototype.process = function (hostname, node_id) {
	coap.request({
		hostname: hostname,
		port: 5683,
		method: "GET",
		pathname: "/sensors/dht22"
	}).on('response', (coap_res) => {
		let response = coap_res._packet.payload.toString('utf8');
		if (response.length > 0) {
			let json_res = JSON.parse(JSON.stringify(eval("(" + response + ")")));
			for (var attr in json_res) {
				console.log(json_res)
				console.log(json_res[attr])
				dataCalc(attr, node_id, parseFloat(json_res[attr]), 5, true, this.list, () => {
					postControl.postData({
						warning: true,
						node_id: node_id,
						count: ++this.count,
						rawData: rawData,
						sensorData: sensorData
					});
					rawData = [];
					sensorData = [];
				});
				dataCalc(attr, node_id, parseFloat(json_res[attr]), 10, false, this.list, () => {
					data = [];
					postControl.postData({
						warning: false,
						node_id: node_id,
						count: ++this.count,
						rawData: rawData,
						sensorData: sensorData
					});
					rawData = [];
					sensorData = [];
				});
			}
		} else console.log('Empty: ', response);
	}).on('error', (coap_res) => console.log('Error: ', coap_res)).end();
}

ServerBoardRegisterRevised.prototype.loadList = function (list) {
	this.list = list;
}

module.exports = ServerBoardRegisterRevised;

function dataCalc(sensortype, node_id, value, size, warning, list, callback) {
	let id = sensortype + node_id;
	if (!data[id]) { data[id] = { value: [] } }

	let dataValue = data[id].value;
	dataValue.push(value);
	if (dataValue.length > size) { dataValue.splice(0, 1); }

	if (warning) {
		if (dataValue.length === size) {
			let value = dataValue.reduce(function (a, b) { return a + b; }) / dataValue.length;
			console.log(sensortype, node_id, value, size, warning, list);
			if (value >= list[node_id].sensorID[sensortype].threshold_max_possible) {
				buildObject(node_id, sensortype, value, warning, list)
				callback();
			}
		}
	} else {
		if (dataValue.length === size) {
			buildObject(node_id, sensortype, dataValue.reduce(function (a, b) { return a + b; }) / dataValue.length, warning, list)
			callback();
		}
	}
}

function buildObject(node_id, sensortype, value, warning, list) {
	let listData = list[node_id];
	if (listData) {
		if (listData.sensorID[sensortype]) {
			rawData.push({
				board_id: listData.board_id,
				sensor_id: listData.sensorID[sensortype].sensor_id,
				transducer: sensortype,
				measure: listData.sensorID[sensortype].measure,
				location: listData.sensorID[sensortype].location,
				datetime: Date.now(),
				value: value
			});
			listData.sensorID[sensortype].avg = value;
			listData.sensorID[sensortype].critState = warning;
			sensorData.push(listData.sensorID[sensortype]);
		}
	}
}