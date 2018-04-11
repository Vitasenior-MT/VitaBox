'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs,
  settinglib = require('./settinglib.js'),
  boardlib = require('./boardlib.js'),
  patientslib = require('./patientslib.js');

var ConnectServer = function () {
  this.token = null;
};

ConnectServer.prototype.setToken = (res) => {
  var self = this;
  settinglib.getToken(null, function (result) {
    result.status ? self.token = result.data[0].token : this.requestToken();
    res({
      status: result.status,
      data: self.token
    });
  });
};

ConnectServer.prototype.postSettings = (res, settings) => {
  let options = createOptions('PUT', this.token, '/settings/vitabox');
  httpReq(options, { settings: settings }, (result) => {
    resultData(res, result, ConnectServer.prototype.postSettings);
  });
};

ConnectServer.prototype.postSensorData = (res, records) => {
  let options = createOptions('POST', this.token, '/record');
  httpReq(options, { records: records }, (result) => {
    resultData(res, result, ConnectServer.prototype.postSensorData);
  });
};

ConnectServer.prototype.getBoards = (res) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/board');
  httpReq(options, false, (result) => {
    resultData((data) => {
      boardlib.postBoards2(JSON.parse(result.responce), (res) => {
        console.log(res);
      });
    }, result, ConnectServer.prototype.getBoards);
  });
};

ConnectServer.prototype.getPatients = (res) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/patient');
  httpReq(options, false, (result) => {
    resultData((data) => {
      patientslib.postPatients(JSON.parse(result.responce), (res) => {
        console.log(res);
      });
    }, result, ConnectServer.prototype.getPatients);
  });
};

ConnectServer.prototype.getSettings = (res) => {
  let options = createOptions('GET', this.token, '/settings/vitabox');
  httpReq(options, false, (result) => {
    resultData(res, result, ConnectServer.prototype.getSettings);
  });
};

ConnectServer.prototype.requestToken = (res) => {
  let options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  httpReq(options, { password: config.pass }, (result) => {
    this.token = JSON.parse(result.responce).token;
    resultData(res, result, ConnectServer.prototype.requestToken);
  });
};

var resultData = function (res, result, func) {
  if (typeof res === 'function') {
    result.status === 200 ?
      res({
        status: result.status,
        data: JSON.parse(result.responce)
      })
      : statusHandler(result.status, func);
  } else {
    if (result.status === 200) {
      return res.json({
        status: result.status,
        data: JSON.parse(result.responce)
      })
    } else {
      statusHandler(result.status, func);
    }
  }
}

var statusHandler = function (statusCode, func) {
  console.log('statusCode');
  console.log(statusCode);
  switch (statusCode) {
    case 401:
      ConnectServer.prototype.requestToken((result) => {
        console.log(result);
        func();
      });
      break;
    case 'ECONNREFUSED':
      console.log('vai fazer alguma coisa ECONNREFUSED');
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
    headers: auth ? {
      'Accept-Version': '1.0.0',
      'Content-Type': 'application/json',
      'Authorization': auth
    } : {
        'Accept-Version': '1.0.0',
        'Content-Type': 'application/json'
      }
  }
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
  var req = httpRes(options, callback);
  req.on('error', function (e) {
    console.error("Error -> ", e);
    statusHandler(e.code);
  });
  adicionalInfo ? req.write(JSON.stringify(adicionalInfo)) : null;
  req.end();
}

module.exports = ConnectServer;