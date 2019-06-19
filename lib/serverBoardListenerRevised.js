'use strict'
var logger = require('./logger'),
	errorLog = logger.errorlog,
	successlog = logger.successlog,
	customInfoLog = logger.customInfoLog('environmentData'),
	iptables = null;

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

/**
 * TODO: Começo do ciclo para os pedidos dos dados aos sensores
 * @param {  }
 */
ServerBoardRegisterRevised.prototype.start = function (iptables) {
	this.iptables = iptables;
	var self = this;
	setInterval(() => { // ciclo dos pedidos
		if (self.nodeIpList.length > 0) { // verifica se a lista está cheia
			for (var attr in self.nodeIpList) { // corre todo o array
				self.process(self.nodeIpList[attr].node_ip, self.nodeIpList[attr].node_id, self.nodeIpList[attr].error_count); // chama a função para fazer o pedido coap
			}
		}
	}, utils.timeCalculator(config.rate.hour, config.rate.min, config.rate.sec)); // tempo em milisegundos até á proxima iteração
}

ServerBoardRegisterRevised.prototype.process = function (hostname, node_id, error_count) {
	var self = this;
	customInfoLog.debug(`Request: ${node_id}`);
	coap.request({
		hostname: hostname,
		port: 5683,
		method: "GET",
		pathname: "/sensors/allsensors",
		multicastTimeout: 300
	}).on('response', (coap_res) => {
		let response = coap_res._packet.payload.toString('utf8');
		if (response.length > 0) {
			let json_res = JSON.parse(response.replace(/\'/g, "\""));
			let data = {
				warning: false,
				node_id: node_id,
				rawData: []
			};
			customInfoLog.debug(`Data: ${json_res}`);
			for (var attr in json_res) {
				if (self.list[node_id]) {
					if (self.list[node_id].sensorID[attr]) {
						buildObject(attr, parseFloat(json_res[attr]), self.list[node_id], data.rawData)
					}
				}
			}
			postControl.postData(data);
		} else customInfoLog.debug(`Empty: ${response}`);
	}).on('error', (coap_res) => {
		customInfoLog.debug(`Error: ${coap_res}, data: ${new Date(Date.now())}, hostname: ${hostname}, node_id: ${node_id}`);
		if (node_id) {
			self.iptables.set(node_id, hostname, error_count, () => {
				console.log('removed');
				/*serverBoardListenerRevised.loadList(self.sensor_list);
						iptables.get((values) => {
							serverBoardListenerRevised.loadIpList(values);
						});*/
			});
		}
	}).end();
}

ServerBoardRegisterRevised.prototype.loadList = function (list) {
	this.list = list;
}

ServerBoardRegisterRevised.prototype.loadIpList = function (nodeIpList) {
	this.nodeIpList = nodeIpList;
}

module.exports = ServerBoardRegisterRevised;

/**
 * TODO: Criação dos objetos para a inserção dos dados no rawsensors e para o post na cloud
 * @param { String } sensortype tipo de transdutores
 * @param { Number } value valor dos transdutores
 * @param { Array } data lista de objetos dos sensores
 */
function buildObject(sensortype, value, listData, data) {
	if (listData) { // verifica se a variavel não é nula
		if (listData.sensorID[sensortype]) { // verifica se existe dados no sensorID
			listData.sensorID[sensortype].avg = value; // atribui o valor do sensor á variável avg
			listData.sensorID[sensortype].critState = false; // atribui o valor de falso ao estado crítico
			data.push({ // inserção do novo objeto no array
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