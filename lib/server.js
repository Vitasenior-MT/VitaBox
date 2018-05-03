'use strict'
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow
var express = require('express'),
	http = require('http'),
	fs = require('fs'),
	socketio = require('socket.io'),
	serverIo = require('./serverSkt'),
	bodyParser = require('body-parser'),
	cp = require('child_process'),
	sensorlib = require('./sensorlib.js'),
	connectDB = require('./connectDB.js'),
	populateDB = require('./populateDB.js'),
	boardListener = require('./boardListener.js'),
	routes = require('./routes.js'),
	bledisp = require('./blelib.js');

const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

/**
 * TODO: Criação do servidor
 * @param {*} config 
 */
var Server = function (config) {
	this.app = express();
	this.server = http.Server(this.app);
	this.io = socketio(this.server);
	this.port = config.port;
	this.env_dev = config.env_dev;
	this.mongodb = config.mongodb;
	connectDB.connectDB(this.mongodb, function () {
		successlog.info(`DataBase is up.`);
	});
	if (this.env_dev) {
		//populateDB.poulareDB();
	}
};
/**
 * TODO: Metodo para iniciar o servidor
 */
Server.prototype.start = function () {
	var self = this;
	self.server.listen(self.port);
	self.skt = new serverIo({ server: self });
	self.skt.init();
	sensorlib.createSensorObj(self.skt);
	bledisp.addsktconn(self.skt);

	/**
	 * TODO: Definição dos parametros do body-parser do express
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
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

	// Fornece a pagina default ao cliente neste caso o 'index.html'
	this.app.use(express.static(__dirname + './../public/dist'));

	// Adiciona o ficheiro com as rotas do servidor
	this.app.use('/', routes);

	successlog.info(`Server HTTP Wait %d ${self.port}`);
}

/**
 * TODO: recebe por parametro no proceso as definições configuradas para o funcionamento do servidor
 */
process.on("message", function (data) {
	var srv = new Server(data.serverdata);
	srv.start();
});

module.exports = Server;
