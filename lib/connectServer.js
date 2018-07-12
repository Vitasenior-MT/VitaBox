'use strict'
var https = require('https'),
  settinglib = require('./settinglib.js'),
  mode = process.env.NODE_ENV || "DEV";

/**
 * TODO:
 */
var ConnectServer = function () {
  this.config = require('./../config-' + mode.toLowerCase() + '/config.js').ServerConfigs;
  this.token = null;
  var self = this;
  settinglib.getToken(null, function (result) {
    if (result.status && result.data.length > 0) {
      self.token = result.data[0].token
    }
  });
}

ConnectServer.prototype.get = function (res, path) {
  this.httpsReq(this.createOptions('GET', this.token, path), false, (result) => {
    res(result);
  });
}

ConnectServer.prototype.post = function (res, data, path) {
  this.httpsReq(this.createOptions('POST', this.token, path), data, (result) => {
    res(result);
  });
}

ConnectServer.prototype.put = function (res, data, path) {
  this.httpsReq(this.createOptions('PUT', this.token, path), data, (result) => {
    res(result);
  });
}

ConnectServer.prototype.requestToken = function (res) {
  var self = this;
  let options = self.createOptions('POST', null, '/vitabox/' + this.config.key + '/connect');
  this.httpsReq(options, { password: self.config.pass }, (result) => {
    if (result.status === 200) {
      self.token = JSON.parse(result.responce).token;
      settinglib.postToken({ body: JSON.parse(result.responce).token }, (data) => {
        res(result.status);
      });
    } else {
      res(result.status);
    }
  });
}

/**
 * TODO:
 */
ConnectServer.prototype.createOptions = function (method, auth, path) {
  var self = this;
  return {
    host: self.config.host,
    port: self.config.port,
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
 */
ConnectServer.prototype.httpsRes = function (options, callback) {
  return https.request(options, function (res) {
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
 */
ConnectServer.prototype.httpsReq = function (options, adicionalInfo, callback) {
  var self = this;
  var req = self.httpsRes(options, callback);
  req.on('error', function (e) {
    console.error("Error -> ", e);
    callback({
      status: e.code,
      responce: e
    });
  });
  adicionalInfo ? req.write(JSON.stringify(adicionalInfo)) : null;
  req.end();
}

module.exports = ConnectServer;