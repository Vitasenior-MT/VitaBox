'use strict'
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;
var sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    connectServerlib = require('./connectServerlib.js'),
    sensors = [],
    dataToSend = [];

module.exports = {
    loadSensors: function () {
        sensorlib.getSensors((result) => {
            sensors = result;
            postSensorData();
        });
    },
    deleteData: function () {
        rawsensorlib.delete((result) => {
            successlog.info(`Regists Deleted: ${result}`);
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
    rawsensorlib.getDataToPost((result) => {
        if (result.length > 0) {
            result.map((doc) => { dataToSend.push(doc); });
        }
        connectServerlib.postSensorData(null, (data) => {
            if (data.status === 200) {
                rawsensorlib.updateFlg(dataToSend, (modified) => {
                    successlog.info(`Data Modified: ${modified.ok} : ${modified.n} : ${modified.nModified}`);
                    setTimeout(() => {
                        dataToSend = [];
                        postSensorData();
                    }, 10000);
                });
            }
        }, dataToSend);
    });
}

