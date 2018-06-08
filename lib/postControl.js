'use strict'
var sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    connectServerlib = require('./connectServerlib.js'),
    utils = require('./utils.js'),
    log = require('./logger'),
    errorLog = log.errorlog,
    successlog = log.successlog,
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
    getPatients: function (res) {
        connectServerlib.getPatients((data) => {
            res(data);
        });
    },
    getBoards: function (res) {
        connectServerlib.getBoards((data) => {
            res(data);
        });
    },
    deleteData: function () {
        setInterval(() => {
            rawsensorlib.delete(false, 24, (result) => {
                successlog.info(`Data Deleted Bio: ${result}`);
            });
            rawsensorlib.delete(true, 720, (result) => {
                successlog.info(`Data Deleted Ambi: ${result}`);
            });
        }, deleteRate);
    },
    postData: function (data) {
        successlog.info(`Package Number: ${data.count} - Node ID: ${data.node_id}`);
        rawsensorlib.insertManyData(data.rawData);
        processSensorData(data.sensorData, data.sensorData.length - 1, data.warning);
    }
}

function processSensorData(result, index, warning) {
    if (index >= 0) {
        sensorlib.update(warning, result[index], () => {
            processSensorData(result, --index, warning);
        });
    }
}