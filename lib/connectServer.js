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
      self.token = result.data[0].token;
    }
  });
}

/**
 * TODO: 
 * @param { Resposta ao request } res
 * @param { Caminho para o endpoint } path
 */
ConnectServer.prototype.get = function (res, path) {
  this.httpsReq(this.createOptions('GET', this.token, path), false, (result) => {
    res(result);
  });
}

/**
 * TODO: 
 * @param { Resposta ao request } res
 * @param {  } data
 * @param { Caminho para o endpoint } path
 */
ConnectServer.prototype.post = function (res, data, path) {
  this.httpsReq(this.createOptions('POST', this.token, path), data, (result) => {
    res(result);
  });
}

/**
 * TODO: 
 * @param { Resposta ao request } res
 * @param {  } data
 * @param { Caminho para o endpoint } path
 */
ConnectServer.prototype.put = function (res, data, path) {
  this.httpsReq(this.createOptions('PUT', this.token, path), data, (result) => {
    res(result);
  });
}

/**
 * TODO: 
 * @param { Resposta ao request } res
 */
ConnectServer.prototype.requestToken = function (res) {
  var self = this;
  this.httpsReq(
    this.createOptions('POST', null, '/api/vitabox/' + this.config.key + '/connect'),
    { password: this.config.pass }, (result) => {
      if (result.status === 200) {
        self.token = JSON.parse(result.responce).token;
        settinglib.postToken({
          data: {
            token: JSON.parse(result.responce).token,
            district: JSON.parse(result.responce).vitabox.district,
            locality: JSON.parse(result.responce).vitabox.locality
          }
        }, (data) => {
          console.log('Complete code: ', result.status);
          res(result.status);
        });
      } else {
        console.log('Complete code: ', result);
        res(result.status);
      }
    });
}

/**
 * TODO: 
 * @param {  } method
 * @param {  } auth
 * @param { Caminho para o endpoint } path
 */
ConnectServer.prototype.createOptions = function (method, auth, path) {
  return {
    host: this.config.host,
    port: this.config.port,
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
 * @param {  } options
 * @param { Resposta ao request } callback
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
 * @param {  } options
 * @param {  } adicionalInfo
 * @param { Resposta ao request } callback
 */
ConnectServer.prototype.httpsReq = function (options, adicionalInfo, callback) {
  var req = this.httpsRes(options, callback);
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