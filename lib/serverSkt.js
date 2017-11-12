
require('colors'); //bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow

var ServerSktIo = function (options) {
    this.server = options.server;
};

ServerSktIo.prototype.init = function () {
    var self = this;

    // Fired upon a connection
    this.server.io.on("connection", function (socket) {

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
  
    });

};

//excepcoes para os erros encontrados
// process.on('uncaughtException', function (err) {
    // console.log('Excepcao capturada: ' + err);
// });

module.exports = ServerSktIo;
