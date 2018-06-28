'use strict'
var cp = require('child_process'),
    log = require('./logger'),
    utils = require('./utils.js'),
    connectServerlib = require('./connectServerlib.js'),
    iptables = require('./models/iptables.js'),
    serverBoardListenerRevised = require('./serverBoardListenerRevised'),
    errorLog = log.errorlog,
    successlog = log.successlog,
    mode = process.env.NODE_ENV || "DEV",
    postControl = require('./postControl.js'),
    timeToNewAttempt = utils.timeCalculator(0, 5, 0),
    sensorlib = require('./sensorlib.js');

serverBoardListenerRevised = new serverBoardListenerRevised();
iptables = new iptables();

var self = module.exports = {
    /**
     * TODO: Loads all the settings for the manager
     * @param {}
     */
    loadSettings: function () {
        this.config = require('./../config-' + mode.toLowerCase() + '/config.js');
        this.child2 = cp.fork('./lib/serverBoardRegister.js');
        this.child3 = cp.fork('./lib/serverBoardListener.js');
        this.sensor_list = [];
        postControl.configurations(this.config.TimersConfig);
        postControl.deleteData();
        self.patientsData();
        self.startBoardServer();

    },
    /**
     * TODO: 
     * @param {skt} 
     */
    addsktconn: function (skt) {
        sensorlib.addsktconn(skt);
    },
    /**
     * TODO: Gets the patient data from the cloud
     * @param {}
     */
    patientsData: function () {
        connectServerlib.getPatients((patient) => {
            if (!patient) {
                setTimeout(() => {
                    self.patientsData();
                }, timeToNewAttempt);
            }
        });
    },
    /**
     * TODO: If there is boards starts the listener and the register process
     * @param {}
     */
    startBoardServer: function () {
        connectServerlib.getBoards((board) => {
            if (board) {
                setTimeout(() => {
                    self.startBoardRegister();
                    self.startBoardListenerRevised();
                    //self.startBoardListener();
                }, 200);
            } else {
                setTimeout(() => {
                    self.startBoardServer();
                }, timeToNewAttempt);
            }
        });
    },
    /**
     * TODO: 
     * @param {}
     */
    startBoardRegister: function () {
        this.child2.send({
            "configsRegister": self.config.ServerBoardRegisterConfigs,
            "node_id_list": []
        });
        this.updateBoardRegisterList();
    },
    /**
     * TODO: 
     * @param {}
     */
    updateBoardRegisterList: function () {
        var self = this;
        sensorlib.getNodeIdList((node_id_list) => {
            self.child2.send({ "node_id_list_update": node_id_list });
        });
        self.child2.on('message', function (data) {
            iptables.insert(data, () => {
                iptables.get((values) => {
                    self.sensor_list = values;
                    serverBoardListenerRevised.loadIpList(values);
                });
            });
        });
    },
    /**
     * TODO: 
     * @param {}
     */
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
                        self.sensor_list[responce.node_id].sensorID[attr].avg = parseInt(sensors[attr]);
                        if (responce.warning) {
                            self.sensor_list[responce.node_id].sensorID[attr].critState = true;
                        } else {
                            self.sensor_list[responce.node_id].sensorID[attr].critState = false;
                        }
                        sensorData.push(self.sensor_list[responce.node_id].sensorID[attr]);
                    }
                }
            }
            postControl.postData({
                warning: responce.warning,
                node_id: responce.node_id,
                count: responce.data["cont"],
                rawData: rawData,
                sensorData: sensorData
            });
        });
    },
    startBoardListenerRevised: function () {
        var self = this;
        sensorlib.getSensors((sensor_list) => {
            self.sensor_list = sensor_list;
            serverBoardListenerRevised.loadList(self.sensor_list);
            iptables.get((values) => {
                serverBoardListenerRevised.loadIpList(values);
            });
            serverBoardListenerRevised.start();
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