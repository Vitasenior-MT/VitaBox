'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs,
  settinglib = require('./settinglib.js'),
  boardlib = require('./boardlib.js'),
  patientslib = require('./patientslib.js');

class ConnectServer {
  constructor() {
    this.token = null;
    setToken(this.token);
  }

  postSettings(res, settings) {
    var self = this;
    let options = self.createOptions('PUT', this.token, '/settings/vitabox');
    self.httpReq(self, options, { settings: settings }, (result) => {
      self.resultData(self, res, result, self.postSettings);
    });
  }

  postSensorData(res, records) {
    var self = this;
    let options = self.createOptions('POST', this.token, '/record');
    self.httpReq(options, { records: records }, (result) => {
      self.resultData(res, result, self.postSensorData);
    });
  }

  getPatients(res) {
    var self = this;
    var options = self.createOptions('GET', this.token, '/vitabox/' + config.key + '/patient');
    self.httpReq(options, false, (result) => {
      self.resultData((data) => {
        patientslib.postPatients(JSON.parse(result.responce), (res) => {
          console.log(res);
        });
      }, result, self.getPatients);
    });
  }

  getBoards(res) {
    var self = this;
    var options = self.createOptions('GET', this.token, '/vitabox/' + config.key + '/board');
    self.httpReq(options, false, (result) => {
      self.resultData((data) => {
        boardlib.postBoards2(JSON.parse(result.responce), (res) => {
          console.log(res);
        });
      }, result, self.getBoards);
    });
  }

  getSettings(res) {
    var self = this;
    let options = self.createOptions('GET', this.token, '/settings/vitabox');
    self.httpReq(options, false, (result) => {
      self.resultData(res, result, self.getSettings);
    });
  }

  createOptions(method, auth, path) {
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

  requestToken() {
    var self = this;
    let options = self.createOptions('POST', null, '/vitabox/' + config.key + '/connect');
    self.httpReq(self, options, { password: config.pass }, (result) => {
      self.resultData((data) => {
        console.log(result);
        this.token = JSON.parse(result.responce).token;
        settinglib.postToken({ body: this.token }, (data) => {
          console.log('data');
          console.log(data);
        });
      }, result);
    });
  }

  resultData(res, result, func) {
    if (typeof res === 'function') {
      result.status === 200 ?
        res({
          status: result.status,
          data: JSON.parse(result.responce)
        })
        : self.statusHandler(result.status, func);
    } else {
      if (result.status === 200) {
        return res.json({
          status: result.status,
          data: JSON.parse(result.responce)
        })
      } else {
        self.statusHandler(result.status, func);
      }
    }
  }

  statusHandler(statusCode, func) {
    var self = this;
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

  httpRes(options, callback) {
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

  httpReq(options, adicionalInfo, callback) {
    var self = this;
    var req = self.httpRes(options, callback);
    req.on('error', function (e) {
      console.error("Error -> ", e);
      self.statusHandler(e.code);
    });
    adicionalInfo ? req.write(JSON.stringify(adicionalInfo)) : null;
    req.end();
  }
}

module.exports = ConnectServer;

var setToken = (token) => {
  settinglib.getToken(null, function (result) {
    if (result.status && result.data.length > 0) { token = result.data[0].token };
  });
};