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
    rawsensorlib = require('./rawsensorlib.js'),
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
        self.child3 = cp.fork('./lib/serverBoardWarning.js');
        self.sensor_list = [];
        postControl.configurations(self.config.TimersConfig);
        postControl.deleteData();
        self.patientsData();
        self.startBoardServer();
        self.verifyDataToPost();

    },
    /**
     * TODO: 
     * @param {skt} 
     */
    addsktconn: function (skt) {
        sensorlib.addsktconn(skt);
    },
    /**
     * TODO: 
     * @param {}
     */
    verifyDataToPost: function () {
        rawsensorlib.postSensorData();
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
        self.updateSensorsList(()=>{
            self.child3.send({});
            self.child3.on('message', function (data) {
                for (var attr in data.data) {
                    self.buildObject(data.node_id, attr, data.data[attr], self.sensor_list)
                }
            });
            self.startBoardRegister();
            self.startBoardListenerRevised();
            connectServerlib.getBoards((board) => {
                setTimeout(() => {
                    self.updateBoardRegisterList();
                }, 200);
            });
        });
    },
    /**
     * TODO: 
     * @param {}
     */
    startBoardRegister: function () {
        self.child2.send({ "node_id_list": [] });
        self.child2.on('message', function (data) {
            iptables.insert(data, () => {
                iptables.get((values) => {
                    serverBoardListenerRevised.loadIpList(values);
                });
            });
        });
        self.updateBoardRegisterList();
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
    updateBoardListenerRevised: function () {
        serverBoardListenerRevised.loadList(self.sensor_list);
        iptables.get((values) => {
            serverBoardListenerRevised.loadIpList(values);
        });
    },
    /**
     * TODO: 
     * @param {}
     */
    updateSensorsList: function (callback) {
        sensorlib.getSensors((sensor_list) => {
            self.sensor_list = sensor_list;
            callback();
        });
    },
    /**
     * TODO: 
     * @param {}
     */
    startBoardListenerRevised: function () {
        serverBoardListenerRevised.loadList(self.sensor_list);
        iptables.get((values) => {
            serverBoardListenerRevised.loadIpList(values);
        });
        serverBoardListenerRevised.start();
    },
    /**
     * TODO: Created the object to post the data and update the internal tables
     * @param { ID from the sensor } node_id
     * @param { Type of transducer } sensortype
     * @param { List of the sensors } list
     */
    buildObject(node_id, sensortype, value, list) {
        let listData = list[node_id];
        if (listData) {
            if (listData.sensorID[sensortype]) {
                listData.sensorID[sensortype].avg = value;
                listData.sensorID[sensortype].critState = true;
                postControl.postData({
                    warning: true,
                    node_id: node_id,
                    rawData: {
                        board_id: listData.board_id,
                        sensor_id: listData.sensorID[sensortype].sensor_id,
                        transducer: sensortype,
                        measure: listData.sensorID[sensortype].measure,
                        location: listData.sensorID[sensortype].location,
                        datetime: Date.now(),
                        value: value
                    },
                    sensorData: listData.sensorID[sensortype]
                });
            }
        }
    }
}