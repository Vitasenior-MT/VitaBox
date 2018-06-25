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
	this.nodeIpList = [];
}

ServerBoardRegisterRevised.prototype.start = function () {
	var self = this;
	setInterval(() => {
		if (self.nodeIpList.length > 0) {
			for (var attr in self.nodeIpList) {
				self.process(self.nodeIpList[attr].node_ip, self.nodeIpList[attr].node_id);
			}
		}
	}, utils.timeCalculator(0, 0, 1));
}

ServerBoardRegisterRevised.prototype.process = function (hostname, node_id) {
	var self = this;
	coap.request({
		hostname: hostname,
		port: 5683,
		method: "GET",
		pathname: "/sensors/dht22"
	}).on('response', (coap_res) => {
		let response = coap_res._packet.payload.toString('utf8');
		if (response.length > 0) {
			let json_res = JSON.parse(response.replace(/\'/g, "\""));
			for (var attr in json_res) {
				dataCalc(attr, node_id, parseFloat(json_res[attr]), 5, true, self.list, () => {
					postControl.postData({
						warning: true,
						rawData: rawData,
						sensorData: sensorData
					});
					rawData = [];
					sensorData = [];
				});
				dataCalc(attr, node_id, parseFloat(json_res[attr]), 10, false, self.list, () => {
					if (rawData.length > 0) {
						postControl.postData({
							warning: false,
							rawData: rawData,
							sensorData: sensorData
						});
						rawData = [];
						sensorData = [];
					}
				});
			}
		} else console.log('Empty: ', response);
	}).on('error', (coap_res) => console.log('Error: ', coap_res)).end();
}

ServerBoardRegisterRevised.prototype.loadList = function (list) {
	this.list = list;
}

ServerBoardRegisterRevised.prototype.loadIpList = function (nodeIpList) {
	this.nodeIpList = nodeIpList;
}

module.exports = ServerBoardRegisterRevised;

function dataCalc(sensortype, node_id, value, size, warning, list, callback) {
	let id = sensortype + node_id;
	if (!data[id]) {
		data[id] = {
			sum: 0,
			count: 0,
			value: []
		}
	}

	let dataValue = data[id].value;
	dataValue.push(value);
	if (dataValue.length > size) { dataValue.splice(0, 1); }

	if (warning) {
		if (dataValue.length === size) {
			let value = dataValue.reduce(function (a, b) { return a + b; }) / dataValue.length;
			if (value >= list[node_id].sensorID[sensortype].threshold_max_possible) {
				buildObject(node_id, sensortype, value, warning, list)
				callback();
			}
		}
	} else {
		data[id].sum = data[id].sum + value;
		data[id].count++;
		if (data[id].count === size) {
			let avg = data[id].sum / data[id].count;
			data[id].sum = 0;
			data[id].count = 0;
			buildObject(node_id, sensortype, avg, warning, list);
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