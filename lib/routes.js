var routes = require('express').Router(),
    connectServerlib = require('./connectServerlib.js'),
    sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    patientslib = require('./patientslib.js'),
    blelib = require('./blelib.js'),
    sensorblelib = require('./sensorBleLib.js');

// Token
routes.post("/api/requestToken", connectServerlib.requestToken);

//Settings
routes.post("/api/postSettings", connectServerlib.postSettings);
routes.get("/api/getSettings", connectServerlib.getSettings);

//Sensors
routes.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensorsInfo);
routes.get("/api/sensor/allCriticalSensors/:critLevel", sensorlib.getAllCriticalSensors);
routes.get("/api/sensor/getAllSensorsByLocation", sensorlib.getAllSensorsByLocation);
routes.get("/api/sensor/getSensorsByLocation", sensorlib.getSensorsByLocation);
/*routes.post("/api/postSensorData", connectServerlib.postSensorData);
routes.get('/api/sensors/places/all', sensorlib.getPlaceSensores);
routes.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensoresInfo);
routes.get('/api/sensors/:place/:sensor', sensorlib.getAllDataFromSensor);
routes.get('/api/getSensorData24', sensorlib.getSensorData24);*/

//Rawsensors
routes.get('/api/getSensorData', rawsensorlib.getSensorData);

//Boards
routes.get("/api/getBoards", connectServerlib.getBoards);

//Patients
routes.get("/api/getPatients", connectServerlib.getPatients);
routes.get("/api/patient/getAll", patientslib.getData);
routes.get("/api/patient/exames/:userid", patientslib.getUserExams);


// Dispositivos Bluetooth
routes.get('/api/ble/:bleDisp/:userid', blelib.execBleDisp);

// Sensors Ble
routes.get('/api/sensorsble/:id', rawsensorlib.getSensorsbleIdAllData);

module.exports = routes;