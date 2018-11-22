'use strict'
var ConnectServer = require('./connectServer'),
  remotelib = require('./remotelib.js'),
  boardlib = require('./boardlib.js'),
  request = require('request'),
  htmlparser = require("htmlparser2"),
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
  confirmation: (callback) => {
    ConnectServer.put((result) => {
      self.handler((code) => {
        if (code === 'newPost') {
          self.confirmation(callback);
        } else {
          callback();
        }
      }, result);
    }, {}, '/notification');
  },
  getBoards: (res) => {
    ConnectServer.get((data) => {
      self.handler((code) => {
        if (code === 'newPost') {
          self.getBoards(res);
        } else {
          boardlib.postBoards(JSON.parse(data.responce), (result) => {
            res(result);
          });
        }
      }, data);
    }, '/vitabox/' + ConnectServer.config.key + '/board');
  },
  getPatients: (res) => {
    ConnectServer.get((data) => {
      self.handler((code) => {
        if (code === 'newPost') {
          self.getPatients(res);
        } else {
          patientslib.postPatients(JSON.parse(data.responce), (result) => {
            res(result);
          });
        }
      }, data);
    }, '/vitabox/' + ConnectServer.config.key + '/patient');
  },
  getSettings: (req, res) => {
    ConnectServer.get((data) => {
      boardlib.postBoards2(JSON.parse(data.data.responce), (result) => {
        console.log(result);
      });
    }, '/settings/vitabox');
  },
  getWarnings: (res) => {
    ConnectServer.get((data) => {
      self.handler((code) => {
        if (code === 'newPost') {
          self.getWarnings(res);
        } else {
          res(data);
        }
      }, data);
    }, '/warning');
  },
  getDistrict: (req, res) => {
    ConnectServer.get((data) => {
      self.handler((code) => {
        if (code === 'newPost') {
          self.getDistrict(req, res);
        } else {
          return res.json({ data: JSON.parse(data.responce) });
          //var dataPharm = [];
          /*request('http://farmaciasdeservico.net/widget/?localidade=santarem%7Ctomar&cor_fundo=%23FFFFFF&cor_titulo=%23000000&cor_texto=%23333333&margem=10&v=1" width="320" height="240" frameborder="0" target="_top"', function (error, response, body) {
            //var parser = new htmlparser.Parser(body, {decodeEntities: true});
           // var textHTML 
           console.log('-----A ', body.replace('Farmácia', 'Farmacia'));
            var handler = new htmlparser.DomHandler(function (error, dom) {
              dataPharm = [];
              for(var i in dom[0].children[3].children){
                if(dom[0].children[3].children[i].children){
                  if(dom[0].children[3].children[i].children !== ''){
                    if(dom[0].children[3].children[i].children[1]){
                      let pharmacy = '';
                      let street = '';
                      let location = '';
                      let contact = '';
                      let disponibility = '';
                      pharmacy = dom[0].children[3].children[i].children[1].children[0].data.replace('\n\t\t\t\t\t\t\t\t\t', "");
                      if(dom[0].children[3].children[i].children[1].next.data){
                        street = dom[0].children[3].children[i].children[1].next.data.replace('\n\t\t\t\t\t\t\t\t\t', "");
                        location = dom[0].children[3].children[i].children[1].next.next.next.data.replace('\n\t\t\t\t\t\t\t\t\t', "");
                        contact = dom[0].children[3].children[i].children[1].next.next.next.next.next.data.replace('\n\t\t\t\t\t\t\t\t\t', "");
                        disponibility = dom[0].children[3].children[i].children[1].next.next.next.next.next.next.next.data.replace('\n\t\t\t\t\t\t\t\t\t', "").replace('\n\t\t\t\t\t\t\t\t', "");
                      }
                      dataPharm.push({
                        pharmacy: pharmacy,
                        street: street,
                        location: location,
                        contact: contact,
                        disponibility: disponibility
                      });
                    }
                  }
                }
              }
              //console.log(data);
              //return res.json(JSON.parse(JSON.stringify(dom[0].children[3].children).replace(/\'/g, "\"")));
            });
            var parser = new htmlparser.Parser(handler);
            parser.write(body);
            parser.done();
            console.log(dataPharm);
            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            //console.log('body:', body); // Print the HTML for the Google homepage.
          });*/
          //return res.json(JSON.parse(data.responce));
        }
      }, data);
    }, '/vitabox/' + ConnectServer.config.key);
  },
  handler(callback, result) {
    if (result.status !== 200) {
      setTimeout(() => {
        ConnectServer.requestToken((code) => {
          console.log(code);
          if (code === 200) {
            index = 0;
            reconnectRate = utils.timeCalculator(config.hour, config.min, config.sec);
            callback('newPost');
          } else {
            self.handler(callback, result);
          }
        });
        index++;
        if (index > 10) {
          reconnectRate = utils.timeCalculator(config.extra.hour, config.extra.min, config.extra.sec);
        }
      }, reconnectRate);
    } else {
      callback({
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