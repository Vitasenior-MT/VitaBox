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
    if (result.status && result.data.length > 0) { self.token = result.data[0].token };
    res({
      status: result.status,
      data: self.token
    });
  });
};

ConnectServer.prototype.postSettings = (res, settings) => {
  var self = this;
  let options = createOptions('PUT', this.token, '/settings/vitabox');
  httpReq(self, options, { settings: settings }, (result) => {
    resultData(self, res, result, self.postSettings);
  });
};

ConnectServer.prototype.postSensorData = (res, records) => {
  var self = this;
  let options = createOptions('POST', this.token, '/record');
  httpReq(self, options, { records: records }, (result) => {
    resultData(self, res, result, self.postSensorData);
  });
};

ConnectServer.prototype.getBoards = (res) => {
  var self = this;
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/board');
  httpReq(self, options, false, (result) => {
    resultData(self, (data) => {
      boardlib.postBoards2(JSON.parse(result.responce), (res) => {
        console.log(res);
      });
    }, result, self.getBoards);
  });
};

ConnectServer.prototype.getPatients = (res) => {
  var self = this;
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/patient');
  httpReq(self, options, false, (result) => {
    resultData(self, (data) => {
      patientslib.postPatients(JSON.parse(result.responce), (res) => {
        console.log(res);
      });
    }, result, self.getPatients);
  });
};

ConnectServer.prototype.getSettings = (res) => {
  var self = this;
  let options = createOptions('GET', this.token, '/settings/vitabox');
  httpReq(self, options, false, (result) => {
    resultData(self, res, result, self.getSettings);
  });
};

ConnectServer.prototype.requestToken = () => {
  var self = this;
  let options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  httpReq(self, options, { password: config.pass }, (result) => {
    resultData(self, (data) => {
      console.log(result);
      this.token = JSON.parse(result.responce).token;
      settinglib.postToken({ body: this.token }, (data) => {
        console.log('data');
        console.log(data);
      });
    }, result);
  });
};

var resultData = function (self, res, result, func) {
  if (typeof res === 'function') {
    result.status === 200 ?
      res({
        status: result.status,
        data: JSON.parse(result.responce)
      })
      : statusHandler(self, result.status, func);
  } else {
    if (result.status === 200) {
      return res.json({
        status: result.status,
        data: JSON.parse(result.responce)
      })
    } else {
      statusHandler(self, result.status, func);
    }
  }
}

var statusHandler = function (self, statusCode, func) {
  console.log('statusCode');
  console.log(statusCode);
  switch (statusCode) {
    case 401:
      self.requestToken((result) => {
        console.log(result);
        console.log(result);
        func();
      });
      break;
    case 'ECONNREFUSED':
      console.log('vai fazer alguma coisa ECONNREFUSED');
      break;
    case 'EHOSTUNREACH':
      console.log('servidor em baixo');
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

var httpReq = function (self, options, adicionalInfo, callback) {
  var req = httpRes(options, callback);
  req.on('error', function (e) {
    console.error("Error -> ", e);
    statusHandler(self, e.code);
  });
  adicionalInfo ? req.write(JSON.stringify(adicionalInfo)) : null;
  req.end();
}

module.exports = ConnectServer;