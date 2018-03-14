'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs,
  settinglib = require('./settinglib.js');

var ConnectServer = function () {
  this.token = null;
};

ConnectServer.prototype.setToken = () => {
  settinglib.getToken2(function (err, result) {
    err ? this.requestToken() : this.token = result[0].token;
  });
};

ConnectServer.prototype.postSettings = () => {
  let options = createOptions('PUT', token, '/settings/vitabox');
  settinglib.getSettings(function (err, result) {
    if (err) {
      console.log('error ', err);
    } else {
      httpReq(options, { settings: result }, (result) => {
        let responce = result.status === 200 ? JSON.parse(result.responce) : result.responce;
        console.log('----------> ', responce);
      });
    }
  });
};

ConnectServer.prototype.postSensorData = () => {
  let options = createOptions('POST', token, '/record');
  settinglib.getSettings(function (err, result) {
    if (err) {
      console.log('error ', err);
    } else {
      httpReq(options, { settings: result }, (result) => {
        let responce = result.status === 200 ? JSON.parse(result.responce) : result.responce;
        console.log('----------> ', responce);
      });
    }
  });
};

ConnectServer.prototype.getBoards = () => {
  var options = createOptions('GET', token, '/vitabox/' + config.key + '/board');
  httpReq(options, false, (result) => {
    let responce = result.status === 200 ? JSON.parse(result.responce) : result.responce;
    console.log('----------> ', responce);
  });
};

ConnectServer.prototype.getPatients = () => {
  var options = createOptions('GET', token, '/vitabox/' + config.key + '/patient');
  httpReq(options, false, (result) => {
    let responce = result.status === 200 ? JSON.parse(result.responce) : result.responce;
    console.log('----------> ', responce);
  });
};

ConnectServer.prototype.getSettings = () => {
  var options = createOptions('GET', token, '/settings/vitabox');
  httpReq(options, false, (result) => {
    let responce = result.status === 200 ? JSON.parse(result.responce) : result.responce;
    console.log('----------> ', responce);
  });
};

ConnectServer.prototype.requestToken = (res) => {
  let options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  httpReq(options, { password: config.pass }, (result) => {
    return res.json({
      status: 'sure',
      data: result.status === 200 ? JSON.parse(result.responce) : result.responce
    });
  });
};

ConnectServer.prototype.requestToken2 = (callback) => {
  let options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  httpReq(options, { password: config.pass }, (result) => {
    console.log(result.status === 200 ? JSON.parse(result.responce) : result.responce);
  });
};

var statusHandler = function (statusCode, callback) {
  switch (statusCode) {
    case 401:
      getToken();
      break;
    case 200:
      break;
    default:
      break;
  }
}

var createOptions = function (method, auth, path) {
  return {
    host: config.host,
    port: config.port,
    path: path,
    method: method,
    headers: {
      'Accept-Version': '1.0.0',
      'Content-Type': 'application/json',
      'Authorization': auth
    }
  };
}

var httpRes = function (options, callback) {
  return http.request(options, function (res) {
    res.setEncoding('utf8');
    let responseString = '';
    res.on('data', function (data) {
      responseString += data;
    });
    res.on('end', function () {
      callback({
        status: res.statusCode,
        responce: responseString
      });
    });
  });
}

var httpReq = function (options, adicionalInfo, callback) {
  try {
    var req = httpRes(options, callback);
    req.on('error', function (e) {
      statusHandler(e);
      console.error("Error -> ", e);
    });
    adicionalInfo ? req.write(JSON.stringify(adicionalInfo)) : null;
    req.end();
  } catch (e) {
    statusHandler(e);
    console.log("Erro ao tentar ligar ao servidor!!!", e);
  }
}

module.exports = ConnectServer;