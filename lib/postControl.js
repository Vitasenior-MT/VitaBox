'use strict'
var sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    utils = require('./utils.js'),
    log = require('./logger'),
    errorLog = log.errorlog,
    successlog = log.successlog,
    deleteRate = utils.timeCalculator(5, 0, 0); // saves the list of all sensor types

module.exports = {
    configurations: function (configs) {
        deleteRate = utils.timeCalculator(configs.deleteRate.hour, configs.deleteRate.min, configs.deleteRate.sec);
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
        successlog.info(`New data to insert: ${data.node_id}`);
        rawsensorlib.insertManyData(data.rawData);
        if(data.warning){
            sensorlib.update(data.warning, data.sensorData);
        } else {
            for(var index in data.rawData){
                sensorlib.update(data.warning, data.rawData[index].sensorData);
            }
        }
    }
}