'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

var coap = require('coap'),
	utils = require('./utils.js'),
	postControl = require('./postControl.js'),
	mode = process.env.NODE_ENV || "DEV",
  	config = require('./../config-' + mode.toLowerCase() + '/config.js').coapConfigs,
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
	}, utils.timeCalculator(config.rate.hour, config.rate.min, config.rate.sec));
}

ServerBoardRegisterRevised.prototype.process = function (hostname, node_id) {
	var self = this;
	coap.request({
		hostname: hostname,
		port: 5683,
		method: "GET",
		pathname: "/sensors/allsensors"
	}).on('response', (coap_res) => {
		let response = coap_res._packet.payload.toString('utf8');
		if (response.length > 0) {
			let json_res = JSON.parse(response.replace(/\'/g, "\""));
			console.log(json_res)
			for (var attr in json_res) {
				if (self.list[node_id]) {
					if (self.list[node_id].sensorID[attr]) {
						dataCalc(attr, node_id, parseFloat(json_res[attr]), config.warningArraySize, true, self.list);
						dataCalc(attr, node_id, parseFloat(json_res[attr]), config.avgSize, false, self.list);
					}
				}
			}
		} else console.log('Empty: ', response);
	}).on('error', (coap_res) => console.log('Error: ', coap_res, ' data: ', new Date(Date.now()), ' hostname: ' + hostname, ' node_id: ' + node_id)).end();
}

ServerBoardRegisterRevised.prototype.loadList = function (list) {
	this.list = list;
}

ServerBoardRegisterRevised.prototype.loadIpList = function (nodeIpList) {
	this.nodeIpList = nodeIpList;
}

module.exports = ServerBoardRegisterRevised;

/**
 * TODO: Calculates the avg of the values from the transducer and the critical avg
 * @param { ID from the sensor } node_id
 * @param { Type of transducer } sensortype
 * @param { Value from the transducer } value
 * @param { Max size of the count till the avg calculation } size
 * @param { Boolean to identify the critical state } warning
 * @param { List of the sensors } list
 */
function dataCalc(sensortype, node_id, value, size, warning, list) {
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
		if (dataValue.length >= size) {
			let value = dataValue.reduce(function (a, b) { return a + b; }) / dataValue.length;
			if (value >= list[node_id].sensorID[sensortype].threshold_max_possible) {
				buildObject(node_id, sensortype, value, warning, list)
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
		}
	}
}

/**
 * TODO: Created the object to post the data and update the internal tables
 * @param { ID from the sensor } node_id
 * @param { Type of transducer } sensortype
 * @param { Value from the transducer } value
 * @param { Boolean to identify the critical state } warning
 * @param { List of the sensors } list
 */
function buildObject(node_id, sensortype, value, warning, list) {
	let listData = list[node_id];
	if (listData) {
		if (listData.sensorID[sensortype]) {
			listData.sensorID[sensortype].avg = value;
			listData.sensorID[sensortype].critState = warning;
			postControl.postData({
				warning: false,
				rawData: {
					board_id: listData.board_id,
					sensor_id: listData.sensorID[sensortype].sensor_id,
					transducer: sensortype,
					measure: listData.sensorID[sensortype].measure,
					location: listData.sensorID[sensortype].location,
					datetime: Date.now(),
					value: value
				},
				sensorData: listData.sensorID[sensortype]
			});
		}
	}
}