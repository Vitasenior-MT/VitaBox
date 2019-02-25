'use strict'
var cp = require('child_process'),
    log = require('./logger'),
    utils = require('./utils.js'),
    connectServerlib = require('./connectServerlib.js'),
    iptables = require('./models/iptables.js'),
    serverBoardListenerRevised = require('./serverBoardListenerRevised'),
    notificationManager = require('./notificationManager.js'),
    errorLog = log.errorlog,
    successlog = log.successlog,
    mode = process.env.NODE_ENV || "DEV",
    postControl = require('./postControl.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    timeToNewAttempt = utils.timeCalculator(0, 5, 0),
    sensorlib = require('./sensorlib.js'),
    retry = null,
    retryPatient = null,
    retryBoard = null,
    index = 0,
    sktcon = null;

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
        timeToNewAttempt = utils.timeCalculator(self.config.TimersConfig.timeToNewAttempt.hour, self.config.TimersConfig.timeToNewAttempt.min, self.config.TimersConfig.timeToNewAttempt.sec);
        postControl.configurations(self.config.TimersConfig);
        postControl.deleteData();
        self.patientsData();
        self.startBoardServer(() => {
            notificationManager.loadSettings(sktcon);
        });
        self.verifyDataToPost();
    },
    /**
     * TODO: 
     * @param {skt} 
     */
    addsktconn: function (skt) {
        sktcon = skt;
        sensorlib.addsktconn(skt);
    },
    /**
     * TODO: Verifica se existe novos registos a serem enviados para a cloud
     * @param {}
     */
    verifyDataToPost: function () {
        clearTimeout(retry);
        rawsensorlib.postSensorData((result) => {
            if (result) { // verifica se existe registos
                retry = setTimeout(() => {
                    self.verifyDataToPost();
                }, utils.timeCalculator(self.config.postRate.hour, self.config.postRate.min, self.config.postRate.sec));
            } else {
                retry = setTimeout(() => {
                    self.verifyDataToPost();
                }, utils.timeCalculator(self.config.postRate.noData.hour, self.config.postRate.noData.min, self.config.postRate.noData.sec));
            }
        });
    },
    /**
     * TODO: Gets the patient data from the cloud
     * @param {}
     */
    patientsData: function () {
        clearTimeout(retryPatient);
        connectServerlib.getPatients((patient) => {
            if (!patient) {
                retryPatient = setTimeout(() => {
                    self.patientsData();
                }, timeToNewAttempt);
            }
        });
    },
    /**
     * TODO: If there is boards starts the listener and the register process
     * @param {}
     */
    startBoardServer: function (callback) {
        self.updateSensorsList(() => {
            self.child3.send({});
            self.child3.on('message', function (data) {
                for (var attr in data.data) {
                    self.buildObject(data.node_id, attr, data.data[attr], self.sensor_list)
                }
            });
            self.startBoardRegister();
            self.startBoardListenerRevised();
            clearTimeout(retryBoard);
            sensorlib.getDistictAll(null, (data) => {
                console.log(data[0].sensors);
                console.log('-------------------------------------');
                setTimeout(() => {
                    processData(data[0].sensors);
                }, 20000);

            });
            connectServerlib.getBoards((board) => {
                //self.child3.send({ thresholds: true });
                retryBoard = setTimeout(() => {
                    self.updateBoardRegisterList();
                    callback();
                }, timeToNewAttempt);
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
     * TODO: Criação dos objetos para a inserção dos dados no rawsensors
     * @param { String } node_id identificação do sensor
     * @param { String } sensortype tipo de transdutores
     * @param { Number } value valor dos transdutores
     * @param { Array } list lista de objetos dos sensores
     */
    buildObject(node_id, sensortype, value, list) {
        let listData = list[node_id];
        if (listData) { // verifica se a variavel não é nula
            if (listData.sensorID[sensortype]) { // verifica se existe dados no sensorID
                listData.sensorID[sensortype].avg = value; // atribui o valor do sensor á variável avg
                listData.sensorID[sensortype].critState = true; // atribui o valor de verdade ao estado crítico
                postControl.postData({ // envia os dados para serem gardados na base de dados
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

function processData(data) {
    let node_id = data[index].node_id;
    console.log(data[index]);
    console.log(node_id);
    iptables.getData({ node_id: node_id }, (result) => {
        console.log('-' + index + '---Max----' + data[index].threshold_max_acceptable + '-----------------------------> ', result[0].node_ip);
        console.log(data[index].sensortype + '_max:' + data[index].threshold_max_acceptable + '#');
        self.child3.send({ message: data[index].sensortype + '_max:' + 1 + '#', host: result[0].node_ip });
        index++;
        if (data[index]) {
            processData(data);
        }
    });
}