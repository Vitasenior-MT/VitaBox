'use strict'
var cp = require('child_process'),
    interval = null,
    log = require('./logger'),
    errorLog = log.errorlog,
    successlog = log.successlog,
    patientslib = require('./patientslib.js'),
    boardlib = require('./boardlib.js'),
    mode = process.env.NODE_ENV || "DEV",
    postControl = require('./postControl.js'),
    sensorlib = require('./sensorlib.js');

var self = module.exports = {
    loadSettings: function () {
        this.config = require('./../config-' + mode.toLowerCase() + '/config.js');
        this.child2 = cp.fork('./lib/serverBoardRegister.js');
        this.child3 = cp.fork('./lib/serverBoardListener.js');
        this.sensor_list = [];
        postControl.configurations(this.config.TimersConfig);
        postControl.startPostProcess();
        //postControl.checkForExpiredData();
        postControl.deleteData();
        self.patientsData();
        self.startBoardServer();

    },
    addsktconn: function (skt) {
        sensorlib.addsktconn(skt);
    },
    patientsData: function () {
        patientslib.verifyPatients((result) => {
            if (!result.status) {
                postControl.getPatients((patient) => {
                    if (!patient) {
                        setTimeout(() => {
                            self.patientsData();
                        }, 2000);
                    }
                });
            }
        });
    },
    startBoardServer: function () {
        boardlib.verifyBoards((result) => {
            if (!result.status) {
                postControl.getBoards((board) => {
                    if (board) {
                        self.startBoardServer();
                    } else {
                        setTimeout(() => {
                            self.startBoardServer();
                        }, 2000);
                    }
                });
            } else {
                self.startBoardRegister();
                self.startBoardListener();
            }
        });
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
    updateBoardRegisterList: function () {
        sensorlib.getNodeIdList((node_id_list) => {
            child2.send({ "node_id_list_update": node_id_list });
        });
    },
    startBoardListener: function () {
        var self = this;
        sensorlib.getSensors((sensor_list) => {
            self.sensor_list = sensor_list;
            self.child3.send({ "configsListener": self.config.ServerBoardListenerConfigs });
        });

        self.child3.on('message', function (responce) {
            let rawData = [];
            let sensorData = [];
            let sensors = responce.data;
            for (var attr in sensors) {
                if (self.sensor_list[responce.node_id]) {
                    if (self.sensor_list[responce.node_id].sensorID[attr]) {
                        rawData.push({
                            board_id: self.sensor_list[responce.node_id].board_id,
                            sensor_id: self.sensor_list[responce.node_id].sensorID[attr].sensor_id,
                            transducer: attr,
                            measure: self.sensor_list[responce.node_id].sensorID[attr].measure,
                            location: self.sensor_list[responce.node_id].sensorID[attr].location,
                            datetime: responce.datetime,
                            value: sensors[attr]
                        });
                        sensorData.push(self.sensor_list[responce.node_id].sensorID[attr]);
                    }
                }
            }
            postControl.postData({
                node_id: responce.node_id,
                count: responce.data["cont"],
                rawData: rawData,
                sensorData: sensorData
            });
        });
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