'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs,
  settinglib = require('./settinglib.js'),
  boardlib = require('./boardlib.js'),
  patientslib = require('./patientslib.js'),
  timeoutCount = 0,
  timeoutCountMax = 3;

/**
 * TODO:
 * @param {}  
 */
var ConnectServer = function () {
  this.token = null;
  var self = this;
  settinglib.getToken(null, function (result) {
    if (result.status && result.data.length > 0) {
      self.token = result.data[0].token
    }
  });
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.postSettings = function (self2, res, settings) {
  var self = self2 ? self2 : this;
  let data = {
    func: self.postSettings,
    method: 'PUT',
    res: res,
    data: settings
  };
  let options = self.createOptions('PUT', self.token, '/settings/vitabox');
  self.httpReq(options, { settings: settings }, (result) => {
    self.resultData(res, result, data)
  }, data);
};

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.postSensorData = function (self2, res, records) {
  var self = self2 ? self2 : this;
  let data = {
    func: self.postSensorData,
    method: 'POST',
    res: res,
    data: records
  };

  let options = self.createOptions('POST', self.token, '/record');
  self.httpReq(options, { records: records }, (result) => {
    self.resultData(res, result, data);
  }, data);
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.getPatients = function (self2, res) {
  var self = self2 ? self2 : this;
  let data = {
    func: self.getPatients,
    method: 'GET',
    res: res
  };
  var options = self.createOptions('GET', self.token, '/vitabox/' + config.key + '/patient');
  self.httpReq(options, false, (result) => {
    self.resultData((data) => {
      patientslib.postPatients(JSON.parse(result.responce), (res) => {
        console.log(res);
      });
    }, result, data);
  }, data);
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.getBoards = function (self2, res) {
  var self = self2 ? self2 : this;
  let data = {
    func: self.getBoards,
    method: 'GET',
    res: res
  };
  var options = self.createOptions('GET', self.token, '/vitabox/' + config.key + '/board');
  self.httpReq(options, false, (result) => {
    self.resultData((data) => {
      boardlib.postBoards2(JSON.parse(result.responce), (res) => {
        console.log(res);
      });
    }, result, data);
  }, data);
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.getSettings = function (self2, res) {
  var self = self2 ? self2 : this;
  let data = {
    func: self.getSettings,
    method: 'GET',
    res: res
  };
  let options = self.createOptions('GET', self.token, '/settings/vitabox');
  self.httpReq(options, false, (result) => {
    self.resultData(res, result, data);
  }, data);
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.requestToken = function (self2, res, data) {
  var self = self2 ? self2 : this;
  let options = self.createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  self.httpReq(options, { password: config.pass }, (result) => {
    self.resultData((resultData) => {
      self.token = resultData.data.token;
      settinglib.postToken({ body: resultData.data.token }, (data) => {
        console.log(data);
        res(data);
      });
    }, result, data);
  }, data);
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.createOptions = function (method, auth, path) {
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

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.resultData = function (res, result, data) {
  var self = this;
  if (typeof res === 'function') {
    result.status === 200 ?
      res({
        status: result.status,
        data: JSON.parse(result.responce)
      })
      : self.statusHandler(result.status, data);
  } else {
    if (result.status === 200) {
      return res.json({
        status: result.status,
        data: JSON.parse(result.responce)
      })
    } else {
      self.statusHandler(result.status, data);
    }
  }
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.statusHandler = function (statusCode, data) {
  timeoutCount >= timeoutCountMax ? data = null : data;
  var self = this;
  console.log(statusCode);
  console.log(data);
  switch (statusCode) {
    case 401:
      console.log('***401***');
      data ? setTimeout(() => {
        timeoutCount++;
        self.requestToken(null, (result) => {
          data.method === 'GET' ? data.func(self, data.res) : data.func(self, data.res, data.data);
        }, data);
        console.log('Timeout: ', timeoutCount);
      }, 5000)
        : timeoutCount = 0
      break;
    case 'ECONNREFUSED':
      console.log('***ECONNREFUSED***');
      self.timeoutFunction(data);
      break;
    case 500:
      console.log('***500***');
      //self.timeoutFunction(data);
      break;
    case 'EHOSTUNREACH':
      console.log('***EHOSTUNREACH***');
      self.timeoutFunction(data);
      break;
    case 'ETIMEDOUT':
      console.log('***ETIMEDOUT***');
      self.timeoutFunction(data);
      break;
    default:
      break;
  }
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.httpRes = function (options, callback) {
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

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.httpReq = function (options, adicionalInfo, callback, data) {
  var self = this;
  var req = self.httpRes(options, callback);
  req.on('error', function (e) {
    console.error("Error -> ", e);
    self.statusHandler(e.code, data);
  });
  adicionalInfo ? req.write(JSON.stringify(adicionalInfo)) : null;
  req.end();
}

/**
 * TODO:
 * @param {}  
 */
ConnectServer.prototype.timeoutFunction = function (data) {
  var self = this;
  data ? setTimeout(() => {
    timeoutCount++;
    console.log('Timeout: ', timeoutCount);
    data.method === 'GET' ? data.func(self, data.res) : data.func(self, data.res, data.data);
  }, 5000)
    : timeoutCount = 0
}

module.exports = ConnectServer;