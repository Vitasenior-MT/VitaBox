'use strict'
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow
var express = require('express'),
	http = require('http'),
	fs = require('fs'),
	socketio = require('socket.io'),
	serverIo = require('./serverSkt'),
	bodyParser = require('body-parser'),
	cp = require('child_process'),
	settinglib = require('./settinglib.js'),
	sensorlib = require('./sensorlib.js'),
	remotelib = require('./remotelib.js'),
	boardlib = require('./boardlib.js'),
	patientslib = require('./patientslib.js'),
	connectServerlib = require('./connectServerlib.js'),
	connectDB = require('./connectDB.js'),
	populateDB = require('./populateDB.js'),
	boardListener = require('./boardListener.js'),
	routes = require('./routes.js'),
	bledisp = require('./blelib.js');

var Server = function (config) {
	this.app = express();
	this.server = http.Server(this.app);
	this.io = socketio(this.server);
	this.port = config.port;
	connectDB.connectDB(config.mongodb, () => {
		console.log('levanto e corro serviços apartir deste momento');
		// console.log(config);
		boardListener.start(config.boardConfig);
		connectServerlib.requestToken(null, (result) => {
			connectServerlib.getBoards(null, (result) => {
				console.log(result);
			});
		});
	});
	populateDB.poulareDB();
};

Server.prototype.start = function () {
	var self = this;
	self.server.listen(self.port);
	self.skt = new serverIo({ server: self });
	self.skt.init();
	sensorlib.createSensorObj(self.skt);
	bledisp.addsktconn(self.skt);

	var allowCrossDomain = function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date');
		next();
	};

	// Configura o servidor
	this.app.use(bodyParser.json({ limit: '10mb' }));
	this.app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
	this.app.use(allowCrossDomain);

	// fornece ao cliente a pagina index.html
	this.app.use(express.static(__dirname + './../public/dist'));
	this.app.use('/', routes);

	console.log('\nServer HTTP Wait %d'.green.bold, self.port);
}

process.on("message", function (data) {
	var srv = new Server(data.serverdata);
	srv.start();
});

module.exports = Server;
