'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var dgram = require('dgram'),
	sbr = null;

var ServerBoardRegister = function () {
	this.server = dgram.createSocket('udp6');
	this.nodeIdList = null;
}

ServerBoardRegister.prototype.start = function (config, nodeIdList) {
	this.nodeIdList = nodeIdList;
	var self = this;
	this.server.on('listening', function () {
		successlog.info(`UDP ServerBoardRegister listening on: ${self.server.address().address} : ${self.server.address().port}`);
	});

	this.server.on('message', function (message, remote) {
		message = message.toString().replace('fe80', 'fd00').replace(/\0[\s\S]*$/g, '');
		var nodeidRaw = message.toString().split(":");
		var nodeid = nodeidRaw[nodeidRaw.length - 1].replace(/\0[\s\S]*$/g, '');
		successlog.info(`NODE List ---- ${self.nodeIdList}`);
		if (self.nodeIdList.find(nodeid)) {
			var message1 = "flag1:" + nodeid;
			self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
				if (err) throw err;
				successlog.info(`NODE ACCEPTED ---- ${nodeid}`);
				successlog.info(`FLAG SENT ---- ${message1}`);
				process.send({
					ip: message,
					node_id: nodeid
				});
			});
		} else {
			var message1 = "flag2:" + nodeid;
			self.server.send(message1, 0, message1.length, remote.port, remote.address, function (err, bytes) {
				if (err) throw err;
				successlog.info(`NODE DECLINED ---- ${nodeid}`);
				successlog.info(`FLAG SENT ---- ${message1}`);
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
		sbr.start(data.configsRegister, data.node_id_list);
	}
});