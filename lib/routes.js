var routes = require('express').Router(),
    sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    patientslib = require('./patientslib.js'),
    blelib = require('./blelib.js'),
    connectServerlib = require('./connectServerlib.js'),
    settingslib = require('./settinglib.js'),
    gitutils = require('./gitUtils.js');

//Sensors
routes.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensorsInfo);
routes.get("/api/sensor/allCriticalSensors", sensorlib.getAllCriticalSensors);
routes.get("/api/sensor/getAllSensorsByLocation", sensorlib.getAllSensorsByLocation);
routes.get("/api/sensor/getSensorsByLocation", sensorlib.getSensorsByLocation);
routes.get("/api/sensor/getDistictAll", sensorlib.getDistictAll);
routes.get("/api/sensor/getListOfLocations", sensorlib.getListOfLocations);
routes.get("/api/sensor/getSensorsInfo/:location", sensorlib.getSensorsInfo);
routes.get("/api/sensor/getThresholds/:location/:sensortype", sensorlib.getThresholds);

//Rawsensors
routes.get('/api/getSensorData', rawsensorlib.getSensorData);
routes.get('/api/rawsensor/getdata/:type', rawsensorlib.getSensorDataByType);
routes.get('/api/rawsensor/getdatalt/:type/:location', rawsensorlib.getSensorDataByTypeAndLocation);
routes.get('/api/sensorsble/:id/:limit', rawsensorlib.getSensorsbleIdAllData);

//Patients
routes.get("/api/patient/getAll", patientslib.getData);
routes.get("/api/patient/exames/:userid", patientslib.getUserExams);


// Dispositivos Bluetooth
routes.get('/api/ble/cancelExam', blelib.cancelExame);
routes.get('/api/ble/:bleDisp/:userid', blelib.execBleDisp);

// Settings
routes.get('/api/settings/get', settingslib.getAppSettings);

//connectServer
routes.get('/api/connectServer/getDistrict', connectServerlib.getDistrict);
routes.get('/api/connectServer/getFarmaciasServico', connectServerlib.getFarmaciasServico);
routes.get('/api/connectServer/getTempo', connectServerlib.getTempo);

// Git
routes.get('/api/git/gitlastupdate', gitutils.getLastGitUpdate);

module.exports = routes;