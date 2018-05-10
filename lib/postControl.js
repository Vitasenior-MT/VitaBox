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
    checkForExpiredData: function () {
        sensorlib.getListOfBoardsID(null, (boardID) => {
            sensorlib.getListOfSensorsID(null, (sensorID) => {
                for(var index = 0; index < boardID.length; index++){
                    for(var i = 0; i < sensorID.length; i++){
                        processData(boardID[index], sensorID[i]);
                    }
                }
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
                    }, 5000);
                });
            }
        }, dataToSend);
    });
}

function processData(board_id, sensor_id) {
    rawsensorlib.avgOutExpiredData(board_id, sensor_id, (result) => {
        successlog.info(`Regists Deleted: ${result}`);
    });
}

