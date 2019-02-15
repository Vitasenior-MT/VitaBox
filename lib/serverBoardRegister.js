'use strict'
var dgram = require('dgram'),
	sbr = null,
	mode = process.env.NODE_ENV || "DEV",
	config = require('./../config-' + mode.toLowerCase() + '/config.js').ServerBoardRegisterConfigs,
	logger = require('./logger'),
	successlog = logger.successlog,
	errorLog = logger.errorlog,
	customInfoLog = logger.customInfoLog('environmentData');

var ServerBoardRegister = function () {
	this.server = dgram.createSocket('udp6');
	this.nodeIdList = null;
}

ServerBoardRegister.prototype.start = function (nodeIdList) {
	this.nodeIdList = nodeIdList;
	var self = this;
	this.server.on('listening', function () {
		customInfoLog.debug(`UDP ServerBoardRegister listening on: ${self.server.address().address} : ${self.server.address().port}`);
	});

	this.server.on('message', function (message, remote) {
		// faz o substitui da string recebida
		message = message.toString().replace('fe80', 'fd00').replace(/\0[\s\S]*$/g, '');
		// divide a string pelos : guardando-a num array
		var nodeidRaw = message.toString().split(":");
		// agarra na ultima posição do array e guarda numa variável
		var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');
		customInfoLog.debug(`NODE List ---- ${self.nodeIdList}`);
		// procura na lista de sensores se existe o sensor a tentar registar-se
		if (self.nodeIdList.find(nodeid)) {
			// cria uma variavel com uma mensagem
			var message1 = "flag1:" + nodeid;
			// envia a mensagem em como aceita o sensor
			self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
				if (err) throw err;
				customInfoLog.debug(`NODE ACCEPTED ---- ${nodeid}`);
				customInfoLog.debug(`FLAG SENT ---- ${message1}`);
				// envia o sensor registado para ser guardado para a tabela de sensores aceites
				process.send({
					ip: message,
					node_id: nodeid
				});
			});
		} else {
			var message1 = "flag2:" + nodeid;
			// envia a mensagem em como rejeita o sensor
			self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
				if (err) throw err;
				customInfoLog.debug(`NODE DECLINED ---- ${nodeid}`);
				customInfoLog.debug(`FLAG SENT ---- ${message1}`);
			});
		}
	});

	this.server.on('error', (err) => {
		errorLog.error(`Error -> ${err}`);
	});

	this.server.bind(config.port, config.host);
}

ServerBoardRegister.prototype.updateList = function (nodeIdList) {
	this.nodeIdList = nodeIdList;
}

module.exports = ServerBoardRegister;

Array.prototype.find = function (node_id) {
	var i = this.length;
	while (i--) {
		if (this[i] === node_id) {
			return true;
		}
	}
	return false;
}

process.on("message", function (data) {
	if (data.node_id_list_update) {
		sbr.updateList(data.node_id_list_update);
	} else {
		sbr = new ServerBoardRegister();
		sbr.start(data.node_id_list);
	}
});