
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow

var NodeCEC = require('./nodecec.js');

var stdin = process.openStdin();

stdin.on('data', function(chunk) { 
    cec.send(chunk);
});

var cec = new NodeCEC();

// start cec connection
cec.start();

var ServerSktIo = function (options) {
    this.server = options.server;
};

ServerSktIo.prototype.init = function () {
    var self = this;
    this.io = this.server.io;

    // Fired upon a connection
    this.io.on("connection", function (socket) {

        var c = socket.request.connection._peername;
        console.log("+++++++++++++++++++++ ADD ++++++++++++++++++++++++++");
        console.log("Connected - " + c.address + " : " + c.port);
        console.log("User - " + socket.id);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");

        // deteta quando o cliente se desconecta do servidor
        socket.on('disconnect', function () {
            console.log("Client Disconnect...");
        });
		
		socket.on('keypress', function(key){
			console.log('keypress: ' + key);
			socket.emit('keypress', key);
		});



        cec.on('ready', function(data) {
            console.log("ready...");
            socket.emit('ready', "ready");

        });

        cec.on('status', function(data) {
            console.log("[" + data.id + "] changed from " + data.from + " to " + data.to); 
            socket.emit('status', data);
        });

        cec.on('key', function(data) {
            console.log(data);
            console.log(data.name);
            socket.emit('datakey', data);
        });

        cec.on('close', function(code) {
            process.exit(0);
        });

        cec.on('error', function(data) {
            console.log('---------------- ERROR ------------------');
            console.log(data);
            console.log('-----------------------------------------');
            socket.emit('error', data);
        });
    });
};

//excepcoes para os erros encontrados
// process.on('uncaughtException', function (err) {
    // console.log('Excepcao capturada: ' + err);
// });

module.exports = ServerSktIo;
