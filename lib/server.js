'use strict'
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow
var express = require('express'),
	http = require('http'),
	fs = require('fs'),
	socketio = require('socket.io'),
	serverIo = require('./serverSkt'),
	bodyParser = require('body-parser'),
	cp = require('child_process'),
	sensorlib = require('./seensorlib.js'),
	locationlib = require('./locationlib.js'),
	remotelib = require('./remotelib.js'),
	connectDB = require('./connectDB.js'),
	populateDB = require('./populateDB.js'),
	connectServer = require('./connectServer');

var Server = function (config) {
	this.app = express();
	this.server = http.Server(this.app);
	this.io = socketio(this.server);
	this.port = config.port;
	connectDB.connectDB(config.mongodb);
	populateDB.poulareDB();
};

Server.prototype.start = function () {
	var self = this;
	self.server.listen(self.port);
	self.skt = new serverIo({ server: self });
	self.skt.init();
	sensorlib.createSensorObj(self.skt);
	connectServer = new connectServer(self.io);

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

	this.app.post("/api/sensor", sensorlib.postSensor);
	this.app.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensoresInfo);
	this.app.get("/api/sensor/allCriticalSensors/:critLevel", sensorlib.getAllCriticalSensors);
	this.app.get("/api/sensor/:place", sensorlib.getSensorsFromPlace);
	this.app.get("/api/sensor/:place/allInfo", sensorlib.getAllInfoFromPlace);
	this.app.get("/api/sensor/:place/:sensor", sensorlib.getSensorsValuesFromPlace);
	this.app.get("/api/sensor/:sensortype/:locationId/:limit", sensorlib.getSensorAvg);

	this.app.get('/api/places/all', locationlib.getAllLocations);

	console.log('\nServer HTTP Wait %d'.green.bold, self.port);
}

process.on("message", function (data) {
	var srv = new Server(data.serverdata);
	srv.start();
});

module.exports = Server;
