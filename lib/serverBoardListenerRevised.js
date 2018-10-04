'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

var coap = require('coap'),
	utils = require('./utils.js'),
	postControl = require('./postControl.js'),
	mode = process.env.NODE_ENV || "DEV",
	config = require('./../config-' + mode.toLowerCase() + '/config.js').coapConfigs;

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
		pathname: "/sensors/allsensors",
		multicastTimeout: 1000
	}).on('response', (coap_res) => {
		let response = coap_res._packet.payload.toString('utf8');
		if (response.length > 0) {
			let json_res = JSON.parse(response.replace(/\'/g, "\""));
			let data = {
				warning: false,
				node_id: node_id,
				rawData: []
			};
			console.log(json_res)
			for (var attr in json_res) {
				if (self.list[node_id]) {
					if (self.list[node_id].sensorID[attr]) {
						buildObject(node_id, attr, parseFloat(json_res[attr]), self.list, data.rawData)
					}
				}
			}
			postControl.postData(data);
		} else console.log('Empty: ', response);
	}).on('error', (coap_res) => console.log('Error: ', coap_res, ' data: ', new Date(Date.now()), ' hostname: ' + hostname, ' node_id: ' + node_id)).end();


	var req = coap.request({
		hostname: hostname,
		port: 5683,
		method: "POST",
		pathname: "/sensors/leds",
		multicastTimeout: 1000
	});

	req.write(JSON.stringify({
		color: 'r',
		mode: 'on'
		//value: '1000'
	}));

	req.on('response', function (res) {
		res.pipe(process.stdout)
		res.on('end', function () {
			console.log('bla');
		})
	})
	req.on('error', (coap_res) => console.log('Error: ', coap_res));
	req.end();
}

ServerBoardRegisterRevised.prototype.loadList = function (list) {
	this.list = list;
}

ServerBoardRegisterRevised.prototype.loadIpList = function (nodeIpList) {
	this.nodeIpList = nodeIpList;
}

module.exports = ServerBoardRegisterRevised;

/**
 * TODO: Created the object to post the data and update the internal tables
 * @param { ID from the sensor } node_id
 * @param { Type of transducer } sensortype
 * @param { Value from the transducer } value
 * @param { List of the sensors } list
 */
function buildObject(node_id, sensortype, value, list, data) {
	let listData = list[node_id];
	if (listData) {
		if (listData.sensorID[sensortype]) {
			listData.sensorID[sensortype].avg = value;
			listData.sensorID[sensortype].critState = false;
			data.push({
				board_id: listData.board_id,
				sensor_id: listData.sensorID[sensortype].sensor_id,
				transducer: sensortype,
				measure: listData.sensorID[sensortype].measure,
				location: listData.sensorID[sensortype].location,
				datetime: Date.now(),
				value: value,
				sensorData: listData.sensorID[sensortype]
			});
		}
	}
}