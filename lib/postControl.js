'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    connectServerlib = require('./connectServerlib.js'),
    utils = require('./utils.js'),
    sensors = [], // object with all the sensors info
    timeTillAvgOutExpiredDate = utils.timeCalculator(5, 0, 0), // In case the configs fail the time wont be messed up
    deleteRate = utils.timeCalculator(5, 0, 0), // In case the configs fail the time wont be messed up
    postRate = utils.timeCalculator(0, 0, 5), // In case the configs fail the time wont be messed up
    boardid = [], // saves the list of all boards
    sensorid = []; // saves the list of all sensor types

module.exports = {
    configurations: function (configs) {
        timeTillAvgOutExpiredDate = utils.timeCalculator(configs.timeTillAvgOutExpiredDate.hour, configs.timeTillAvgOutExpiredDate.min, configs.timeTillAvgOutExpiredDate.sec);
        deleteRate = utils.timeCalculator(configs.deleteRate.hour, configs.deleteRate.min, configs.deleteRate.sec);
        postRate = utils.timeCalculator(configs.postRate.hour, configs.postRate.min, configs.postRate.sec);
    },
    loadSensors: function () {
        sensorlib.getSensors((result) => {
            sensors = result;
            postSensorData();
        });
    },
    deleteData: function () {
        setInterval(() => {
            rawsensorlib.delete((result) => {
                successlog.info(`Data Deleted: ${result}`);
            });
        }, deleteRate);
    },
    checkForExpiredData: function () {
        sensorlib.getListOfBoardsID(null, (boardID) => {
            sensorlib.getListOfSensorsID(null, (sensorID) => {
                boardid = boardID;
                sensorid = sensorID;
                building();
            });
        });

    },
    postData: function (data, functions) {
        successlog.info(`Package Number: ${data.counter} - Node ID: ${data.node_id}`);
        rawsensorlib.insert(data, sensors, (result) => {
            rawsensorlib.updateAvg(result, (res) => {
                result.sensorData.avg = res;
                sensorlib.update(result, null, functions);
            });
        });
    }
}

function postSensorData() {
    let dataToSend = [];
    rawsensorlib.getDataToPost((result) => {
        if (result.length > 0) {
            result.map((doc) => { dataToSend.push(doc); });
            connectServerlib.postSensorData(null, (data) => {
                if (data.status === 200) {
                    rawsensorlib.updateFlg(dataToSend, (modified) => {
                        successlog.info(`Data Modified: ${modified.ok} : ${modified.n} : ${modified.nModified}`);
                        setTimeout(() => {
                            postSensorData();
                        }, postRate);
                    });
                }
            }, dataToSend);
        }
    });
}

function building() {
    setInterval(() => {
        for (var index = 0; index < boardid.length; index++) {
            for (var i = 0; i < sensorid.length; i++) {
                processData(boardid[index], sensorid[i]);
            }
        }
    }, timeTillAvgOutExpiredDate);
}

function processData(board_id, sensor_id) {
    rawsensorlib.avgOutExpiredData(board_id, sensor_id, (result) => {
        successlog.info(`Data Deleted: ${result}`);
    });
}