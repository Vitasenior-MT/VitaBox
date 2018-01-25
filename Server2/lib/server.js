
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow
var express = require('express'),
	http = require('http'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	cp = require('child_process');

var Server = function (config) {
  this.app = express();
  this.server = http.Server(this.app);
  this.port = config.port;
	this.remoteserver = config.remoteserver;
	this.remoteport = config.remoteport;
};

Server.prototype.start = function () {
	var self = this;
	self.server.listen(self.port);

	var allowCrossDomain = function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date');
		next();
	};

	// Configura o servidor
	this.app.use(bodyParser.json({limit: '10mb'}));
	this.app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
	this.app.use(allowCrossDomain);

	// fornece ao cliente a pagina index.html
	this.app.use(express.static(__dirname + './../www'));

	this.app.post("/app/sensor", (req, res) => {
		var self = this;
		console.log("teste req", req.body);
		var jsonObject = JSON.stringify(req.body);

		var options = {
				host: this.remoteserver,
				port: this.remoteport,
				path: '/api/sensor',
				method: 'POST',
				headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(jsonObject)
				}
		};
		// console.log(options);
		try {
				var req = http.request(options, function(res) {
						console.log('STATUS: ' + res.statusCode);
						res.setEncoding('utf8');
						var responseString = '';
						res.on('data', function(data) {
								responseString += data;
						});
						res.on('end', function() {
								console.log("Receive - ", responseString);
						});
				});
				req.write(jsonObject);
				req.end();
				req.on('error', function(e) {
						console.error("Error -> ", e);
				});
		} catch (e) {
				console.log("Erro ao tentar ligar ao servidor remoto!!!", e)
		}

		return res.json({
      status : true
    });
	});

	console.log('\nServer HTTP Wait %d'.green.bold, self.port);
}

process.on("message", function (data) {
	var srv = new Server(data.serverdata);
	srv.start();
});

module.exports = Server;
