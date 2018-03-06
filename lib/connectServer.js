'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs;

function ServerComunication() { }

ServerComunication.prototype.requestComunication = function () {
  var options = {
    host: config.host,
    port: config.port,
    path: '/vitabox/7256726f-8a17-47d8-b8e8-18fff8ae19e7/connect',
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
    });
    /*req.write(jsonObject);
    req.end();*/
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

module.exports = ServerComunication;