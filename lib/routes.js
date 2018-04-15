var routes = require('express').Router(),
    connectServerlib = require('./connectServerlib.js'),
    sensorlib = require('./sensorlib.js'),
    patientslib = require('./patientslib.js'),
    bledisp = require('./blelib.js');

// Token
routes.post("/api/requestToken", connectServerlib.requestToken);

//Settings
routes.post("/api/postSettings", connectServerlib.postSettings);
routes.get("/api/getSettings", connectServerlib.getSettings);

//Sensors
routes.post("/api/sensor", sensorlib.postSensor);
routes.post("/api/postSensorData", connectServerlib.postSensorData);
routes.get('/api/sensors/places/all', sensorlib.getPlaceSensores);
routes.get("/api/sensor/allCriticalSensors/:critLevel", sensorlib.getAllCriticalSensors);
routes.get("/api/sensor/allPlaceSensorsInfo", sensorlib.getAllSensoresPlaceInfo);
routes.get("/api/sensor/getSensorsByLocation", sensorlib.getSensorsByLocation);
routes.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensoresInfo);
routes.get('/api/sensors/:place/:sensor', sensorlib.getAllDataFromSensor);

//Boards
routes.get("/api/getBoards", connectServerlib.getBoards);

//Patients
routes.get("/api/getPatients", connectServerlib.getPatients);
routes.get("/api/getPatientsData", patientslib.getData);

// Dispositivos Bluetooth
routes.get('/api/ble/:bleDisp', bledisp.execBleDisp);

module.exports = routes;