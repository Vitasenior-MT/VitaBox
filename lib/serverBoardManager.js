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
        self.config = require('./../config-' + mode.toLowerCase() + '/config.js');
        self.child2 = cp.fork('./lib/serverBoardRegister.js');
        self.sensor_list = [];
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
        self.startBoardRegister();
        self.startBoardListenerRevised();
        connectServerlib.getBoards((board) => {
            setTimeout(() => {
                self.updateBoardRegisterList();
            }, 200);
        });
    },
    /**
     * TODO: 
     * @param {}
     */
    startBoardRegister: function () {
        self.child2.send({
            "configsRegister": self.config.ServerBoardRegisterConfigs,
            "node_id_list": []
        });
        self.child2.on('message', function (data) {
            iptables.insert(data, () => {
                iptables.get((values) => {
                    self.sensor_list = values;
                    serverBoardListenerRevised.loadIpList(values);
                });
            });
        });
        this.updateBoardRegisterList();
    },
    /**
     * TODO: 
     * @param {}
     */
    updateBoardRegisterList: function () {
        sensorlib.getNodeIdList((node_id_list) => {
            self.child2.send({ "node_id_list_update": node_id_list });
        });
    },
    /**
     * TODO: 
     * @param {}
     */
    startBoardListenerRevised: function () {
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