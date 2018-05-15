'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var cp = require('child_process'),
    interval = null,
    mode = process.env.NODE_ENV || "DEV",
    postControl = require('./postControl.js'),
    sensorlib = require('./sensorlib.js');

var self = module.exports = {
    loadSettings: function () {
        this.config = require('./../config-' + mode.toLowerCase() + '/config.js');
        this.child2 = cp.fork('./lib/serverBoardRegister.js');
        this.child3 = cp.fork('./lib/serverBoardListener.js');
        postControl.configurations(this.config.TimersConfig);
        postControl.loadSensors();
        postControl.checkForExpiredData();
        postControl.deleteData();

        self.startBoardListener();
        self.startBoardRegister();
    },
    addsktconn: function (skt) {
        sensorlib.addsktconn(skt);
    },
    startBoardRegister: function () {
        var self = this;
        sensorlib.getNodeIdList((node_id_list) => {
            self.child2.send({
                "configsRegister": self.config.ServerBoardRegisterConfigs,
                "node_id_list": node_id_list
            });
        });
    },
    updateBoardRegisterList: function (data) {
        child2.send({ "node_id_list_update": data });
    },
    startBoardListener: function () {
        var self = this;
        sensorlib.getSensortypeList(null, (sensor_type_list) => {
            self.child3.send({
                "configsListener": self.config.ServerBoardListenerConfigs,
                "sensor_type_list": sensor_type_list
            });
        });

        self.child3.on('message', function (responce) {
            postControl.postData(responce.sensorData);
        });
    },
    updateBoardListenerList: function (data) {
        child3.send({ "sensor_type_list_update": data });
    }
}

/*
function isRunning(linux) {
    return new Promise(function (resolve, reject) {
      const plat = process.platform
      const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
      const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
      if (cmd === '' || proc === '') {
        resolve(false)
      }
      exec(cmd, function (err, stdout, stderr) {
        resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
      })
    })
  }*/