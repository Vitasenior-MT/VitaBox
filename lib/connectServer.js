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

ConnectServer.prototype.postSettings = (res) => {
  let options = createOptions('PUT', this.token, '/settings/vitabox');
  settinglib.getSettings(function (err, result) {
    if (err) {
      console.log('error ', err);
    } else {
      httpReq(options, { settings: result }, (result) => {
        return res.json({
          status: result.status,
          data: result.status === 200 ? JSON.parse(result.responce) : result.responce
        });
      });
    }
  });
};

ConnectServer.prototype.postSettings2 = () => {
  let options = createOptions('PUT', this.token, '/settings/vitabox');
  settinglib.getSettings(function (err, result) {
    if (err) {
      console.log('error ', err);
    } else {
      httpReq(options, { settings: result }, (result) => {
        return res.json({
          status: result.status,
          data: result.status === 200 ? JSON.parse(result.responce) : result.responce
        });
      });
    }
  });
};

ConnectServer.prototype.postSensorData = (res) => {
  let options = createOptions('POST', this.token, '/record');
  seensorlib.getSensorData2(function (result) {
    let records = result;
    for (var index in records) {
      records[index].board_id = "fd00::212:4b00:60d:60c8";
    }
    console.log(records);
    httpReq(options, { records: records }, (result) => {
      return res.json({
        status: result.status,
        data: result.status === 200 ? JSON.parse(result.responce) : result.responce
      });
    });
  });
};

ConnectServer.prototype.getBoards = (res) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/board');
  httpReq(options, false, (result) => {
    boardlib.postBoards2(JSON.parse(result.responce), (res) => {
      console.log(res);
    });
    return res.json({
      status: result.status,
      data: result.status === 200 ? JSON.parse(result.responce) : result.responce
    });
  });
};

ConnectServer.prototype.getBoards2 = (callback) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/board');
  httpReq(options, false, (result) => {
    callback(result.status === 200 ? JSON.parse(result.responce) : result.responce);
  });
};

ConnectServer.prototype.getPatients = (res) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/patient');
  httpReq(options, false, (result) => {
    patientslib.postPatients2(JSON.parse(result.responce), (res) => {
      console.log(res);
    });
    return res.json({
      status: result.status,
      data: result.status === 200 ? JSON.parse(result.responce) : result.responce
    });
  });
};

ConnectServer.prototype.getPatients2 = (callback) => {
  var options = createOptions('GET', this.token, '/vitabox/' + config.key + '/patient');
  httpReq(options, false, (result) => {
    callback(result.status === 200 ? JSON.parse(result.responce) : result.responce);
  });
};

ConnectServer.prototype.getPatientsData = (req, res) => {
  patientslib.getData(req, res);
};

ConnectServer.prototype.getSettings = (res) => {
  let options = createOptions('GET', this.token, '/settings/vitabox');
  httpReq(options, false, (result) => {
    return res.json({
      status: result.status,
      data: result.status === 200 ? JSON.parse(result.responce) : result.responce
    });
  });
};

ConnectServer.prototype.getSettings2 = (callback) => {
  let options = createOptions('GET', this.token, '/settings/vitabox');
  httpReq(options, false, (result) => {
    callback(result.status === 200 ? JSON.parse(result.responce) : result.responce);
  });
};

ConnectServer.prototype.requestToken = (res) => {
  let options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  httpReq(options, { password: config.pass }, (result) => {
    this.token = JSON.parse(result.responce).token;
    return res.json({
      status: result.status,
      data: result.status === 200 ? JSON.parse(result.responce) : result.responce
    });
  });
};

ConnectServer.prototype.requestToken2 = (callback) => {
  let options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
  httpReq(options, { password: config.pass }, (result) => {
    this.token = JSON.parse(result.responce).token;
    callback(result.status === 200 ? JSON.parse(result.responce) : result.responce);
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