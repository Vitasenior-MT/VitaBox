'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs;

function ServerComunication(skt) {
  this.start(skt);
}

ServerComunication.prototype.requestComunication = function () {
  var options = {
    host: config.host,
    port: config.port,
    path: '/vitabox/' + config.key + '/connect',
    method: 'POST',
    headers: {
      'Accept-Version': '1.0.0',
      'Content-Type': 'application/json'
    }
  };
  console.log('-----> ', options);
  try {
    var req = http.request(options, function (res) {
      console.log('RES: ', res);
      if (this.skt) {
        this.skt.sockets.emit("responceToken", res);
      }
    });
    req.on('error', function (e) {
      console.error("Error -> ", e);
    });

    req.write(JSON.stringify({ password: 'passvita' }));
    req.end();
  } catch (e) {
    console.log("Erro ao tentar ligar ao servidor!!!", e);
  }
}

ServerComunication.prototype.postData = function () {
  var options = {
    host: config.host,
    port: config.port,
    path: '/api/sensor',
    method: 'POST'/*,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject)
        }*/
  };

  console.log('-----> ', config);
  console.log('-----> ', options);
  /*try {
      var req = http.request(options, function (res) {
          console.log('STATUS: ' + res.statusCode);
          res.setEncoding('utf8');
          var responseString = '';
          res.on('data', function (data) {
              responseString += data;
          });
          res.on('end', function () {
              console.log("Receive - ", responseString);
          });
      });
      req.write(jsonObject);
      req.end();
      req.on('error', function (e) {
          console.error("Error -> ", e);
      });
  } catch (e) {
      console.log("Erro ao tentar ligar ao servidor remoto!!!", e)
  }*/
}

ServerComunication.prototype.start = function (skt) {
  this.skt = skt;
  skt.on("connection", function (socket) {
    socket.on("request_token", function () {
      var options = {
        host: config.host,
        port: config.port,
        path: '/vitabox/' + config.key + '/connect',
        method: 'POST',
        headers: {
          'Accept-Version': '1.0.0',
          'Content-Type': 'application/json'
        }
      };
      console.log('-----> ', options);
      try {
        var req = http.request(options, function (res) {
          console.log('STATUS: ' + res.statusCode);
          res.setEncoding('utf8');
          var responseString = '';
          res.on('data', function (data) {
            responseString += data;
          });
          res.on('end', function () {
            console.log("Receive - ", responseString);
            socket.emit("responceToken", {
              host: config.host,
              port: config.port,
              path: '/vitabox/' + config.key + '/connect',
              method: 'POST',
              headers: {
                'Accept-Version': '1.0.0',
                'Content-Type': 'application/json'
              },
              status: res.statusCode,
              responce: JSON.parse(responseString)
            });
          });
        });
        req.on('error', function (e) {
          console.error("Error -> ", e);
        });

        req.write(JSON.stringify({ password: 'passvita' }));
        req.end();
      } catch (e) {
        console.log("Erro ao tentar ligar ao servidor!!!", e);
      }
    });

    
  });
}

module.exports = ServerComunication;