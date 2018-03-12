'use strict'
var http = require('http'),
  config = require('./../config.js').ServerConfigs;

module.exports = {
  requestToken: () => {
    var options = createOptions('POST', null, '/vitabox/' + config.key + '/connect');
    var adicionalInfo = {
      password: 'passvita'
    }
    httpReq(options, adicionalInfo);
  },
  postSettings: () => {
    var options = createOptions('PUT', token, '/settings/vitabox');
    var adicionalInfo = {
      settings: ''
    }
    httpReq(options, adicionalInfo);
  },
  postSensorData: () => {
    var options = createOptions('POST', token, '/record');
    var adicionalInfo = {
      
    }
    httpReq(options, adicionalInfo);
  },
  getBoards: () => {
    var options = createOptions('GET', token, '/vitabox/' + config.key + '/board');
    httpReq(options, false);
  },
  getPatients: () => {
    var options = createOptions('GET', token, '/vitabox/' + config.key + '/patient');
    httpReq(options, false);
  },
  getSettings: () => {
    var options = createOptions('GET', token, '/settings/vitabox');
    httpReq(options, false);
  }
};

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

var httpRes = function (options) {
  return http.request(options, function (res) {
    res.setEncoding('utf8');
    let responseString = '';
    res.on('data', function (data) {
      responseString += data;
    });
    res.on('end', function () {
      let responce = null;
      if (res.statusCode === 200) {
        responce = JSON.parse(responseString);
      } else {
        responce = responseString;
      }
    });
  });

}

var httpReq = function (options, adicionalInfo) {
  try {
    var req = httpRes(options);
    req.on('error', function (e) {
      console.error("Error -> ", e);
    });
    if (adicionalInfo) {
      req.write(JSON.stringify(adicionalInfo));
    }
    req.end();
  } catch (e) {
    console.log("Erro ao tentar ligar ao servidor!!!", e);
  }
}