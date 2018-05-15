'use strict'
var ConnectServer = require('./connectServer'),
  remotelib = require('./remotelib.js'),
  sensorlib = require('./sensorlib.js'),
  boardlib = require('./boardlib.js'),
  patientslib = require('./patientslib.js'),
  utils = require('./utils.js'),
  mode = process.env.NODE_ENV || "DEV",
  config = require('./../config-' + mode.toLowerCase() + '/config.js').ReconnectRate,
  reconnectRate = utils.timeCalculator(config.hour, config.min, config.sec),
  index = 0;

ConnectServer = new ConnectServer();

var self = module.exports = {
  postSettings: (req, res) => {
    remotelib.getSettings(function (err, data) {
      err ? console.log('error ', err) : ConnectServer.put((result) => {
        self.handler((code) => {
          if (code === 'newPost') {
            self.postSettings(req, res);
          } else {
            res(code);
          }
        }, result);
      }, { settings: data }, '/settings/vitabox');
    });
  },
  postSensorData: (req, res, data) => {
    ConnectServer.post((result) => {
      self.handler((code) => {
        if (code === 'newPost') {
          self.postSensorData(req, res, data);
        } else {
          res(code);
        }
      }, result);
    }, { records: data }, '/record');
  },
  getBoards: (req, res) => {
    ConnectServer.get((data) => {
      boardlib.postBoards2(JSON.parse(data.responce), (result) => {
        console.log(result);
      });
    }, '/vitabox/' + ConnectServer.config.key + '/board');
  },
  getPatients: (req, res) => {
    ConnectServer.get((data) => {
      patientslib.postPatients(JSON.parse(data.responce), (result) => {
        console.log(result);
      });
    }, '/vitabox/' + ConnectServer.config.key + '/patients');
  },
  getSettings: (req, res) => {
    ConnectServer.get((data) => {
      boardlib.postBoards2(JSON.parse(data.responce), (result) => {
        console.log(result);
      });
    }, '/settings/vitabox');
  },
  handler(res, result) {
    if (result.status !== 200) {
      setTimeout(() => {
        ConnectServer.requestToken((code) => {
          console.log(code);
          if (code === 200) {
            index = 0;
            reconnectRate = utils.timeCalculator(config.hour, config.min, config.sec);
            res('newPost');
          } else {
            self.handler(res, result);
          }
        });
        index++;
        if (index > 10) {
          reconnectRate = utils.timeCalculator(config.extra.hour, config.extra.min, config.extra.sec);
        }
      }, reconnectRate);
    } else {
      res({
        status: result.status,
        data: result.data
      });
    }
  }
};

//vale a pena usar isto????????
function statusHandler(statusCode, res) {
  switch (statusCode) {
    case 401:
      console.log('***401***');
      this.sendCode(statusCode, res);
      break;
    case 'ECONNREFUSED':
      console.log('***ECONNREFUSED***');
      this.sendCode(statusCode, res);
      break;
    case 413:
      console.log('***413***');
      this.sendCode(statusCode, res);
      break;
    case 500:
      console.log('***500***');
      this.sendCode(statusCode, res);
      break;
    case 'EHOSTUNREACH':
      console.log('***EHOSTUNREACH***');
      this.sendCode(statusCode, res);
      break;
    case 'ETIMEDOUT':
      console.log('***ETIMEDOUT***');
      this.sendCode(statusCode, res);
      break;
    case 'ENOTFOUND':
      console.log('***ENOTFOUND***');
      this.sendCode(statusCode, res);
      break;
    default:
      break;
  }
}