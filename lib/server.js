'use strict'
/**
 * Class QUe disponibiliza o servidor HTTP, disponibiliza WebSockets e responde aos vários request solicitados dos clientes
 */
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow
var express = require('express'),
	http = require('http'),
	socketio = require('socket.io'),
	serverIo = require('./serverSkt'),
	bodyParser = require('body-parser'),
	connectDB = require('./connectDB.js'),
	populateDB = require('./populateDB.js'),
	serverBoardManager = require('./serverBoardManager.js'),
	routes = require('./routes.js'),
	bledisp = require('./blelib.js'),
	log = require('./logger'),
	errorLog = log.errorlog,
	successlog = log.successlog;

/**
 * TODO: Criação do servidor
 * @param {object} config - Variavel que contem as configurações básicas para o inicio do servidor.
 */
var Server = function (config) {
	var self = this;
	this.app = express();
	this.server = http.Server(this.app);
	this.io = socketio(this.server);
	this.port = config.port;
	this.env_dev = config.env_dev;
	this.mongodb = config.mongodb;
	this.TimersConfig = config.TimersConfig;
	connectDB.connectDB(this.mongodb, function () {
		successlog.info(`DataBase is up.`);
		populateDB.poulareDB(self.env_dev);

		serverBoardManager.loadSettings();
		self.start();
	});
};
/**
 * TODO: Metodo para iniciar o servidor
 */
Server.prototype.start = function () {
	var self = this;
	self.server.listen(self.port);
	self.skt = new serverIo({ server: self, TimersConfig: self.TimersConfig });
	self.skt.init();
	serverBoardManager.addsktconn(self.skt);
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
	if (data.serverdata) {
		var srv = new Server(data.serverdata);
	}
});

module.exports = Server;
