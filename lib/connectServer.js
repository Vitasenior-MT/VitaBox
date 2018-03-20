'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs,
  settinglib = require('./settinglib.js'),
  seensorlib = require('./seensorlib.js'),
  boardlib = require('./boardlib.js'),
  patientslib = require('./patientslib.js');

var ConnectServer = function () {
  this.token = null;
};

ConnectServer.prototype.setToken = () => {
  settinglib.getToken2(function (err, result) {
    err ? this.requestToken() : this.token = result[0].token;
  });
};

ConnectServer.prototype.postSettings = (req, res, settings) => {
  let options = createOptions('PUT', this.token, '/settings/vitabox');
  httpReq(options, { settings: settings }, (result) => {
    resultData(req, res, result);
  });
};

ConnectServer.prototype.postSensorData = (req, res, records) => {
  let options = createOptions('POST', this.token, '/record');
  httpReq(options, { records: records }, (result) => {
    resultData(req, res, result);
  });
};

ConnectServer.prototype.getBoards = (req, res) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/board');
  httpReq(options, false, (result) => {
    boardlib.postBoards2(JSON.parse(result.responce), (res) => {
      console.log(res);
    });
    resultData(req, res, result);
  });
};

ConnectServer.prototype.getPatients = (req, res) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/patient');
  httpReq(options, false, (result) => {
    patientslib.postPatients2(JSON.parse(result.responce), (res) => {
      console.log(res);
    });
    resultData(req, res, result);
  });
};

ConnectServer.prototype.getSettings = (res, req) => {
  let options = createOptions('GET', this.token, '/settings/vitabox');
  httpReq(options, false, (result) => {
    resultData(req, res, result);
  });
};

ConnectServer.prototype.requestToken = (req, res) => {
  let options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  httpReq(options, { password: config.pass }, (result) => {
    this.token = JSON.parse(result.responce).token;
    resultData(req, res, result);
  });
};

var resultData = function (req, res, result) {
  if (req) {
    return res.json({
      status: result.status,
      data: result.status === 200 ? JSON.parse(result.responce) : result.responce
    })
  } else {
    res(result.status === 200 ? JSON.parse(result.responce) : result.responce);
  }
}

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