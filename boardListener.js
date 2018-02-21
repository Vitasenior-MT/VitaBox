var PORT = 10000;
var HOST = 'fd00::1'; var dgram = require('dgram');
var server = dgram.createSocket('udp6'); server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
});
server.bind(PORT, HOST);