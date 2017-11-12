require('colors');
var cp = require('child_process'),
	fs = require('fs');
	
var Main = function () {
  var args = {
      port: 8088
    };
    // inicia p script e envia as configuracores do ficheiro ini
    var child2 = cp.fork('./lib/server.js');
    child2.send({"serverdata" : args});
};

new Main();

module.exports = Main;