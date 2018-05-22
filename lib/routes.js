var routes = require('express').Router(),
    sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    patientslib = require('./patientslib.js'),
    blelib = require('./blelib.js');

//Sensors
routes.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensorsInfo);
routes.get("/api/sensor/allCriticalSensors/:critLevel", sensorlib.getAllCriticalSensors);
routes.get("/api/sensor/getAllSensorsByLocation", sensorlib.getAllSensorsByLocation);
routes.get("/api/sensor/getSensorsByLocation", sensorlib.getSensorsByLocation);
routes.get("/api/sensor/getDistictAll", sensorlib.getDistictAll);

/*routes.post("/api/postSensorData", connectServerlib.postSensorData);
routes.get('/api/sensors/places/all', sensorlib.getPlaceSensores);
routes.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensoresInfo);
routes.get('/api/sensors/:place/:sensor', sensorlib.getAllDataFromSensor);
routes.get('/api/getSensorData24', sensorlib.getSensorData24);*/

//Rawsensors
routes.get('/api/getSensorData', rawsensorlib.getSensorData);
routes.get('/api/rawsensor/getdata/:type', rawsensorlib.getSensorDataByType);
routes.get('/api/sensorsble/:id/:limit', rawsensorlib.getSensorsbleIdAllData);

//Patients
routes.get("/api/patient/getAll", patientslib.getData);
routes.get("/api/patient/exames/:userid", patientslib.getUserExams);


// Dispositivos Bluetooth
routes.get('/api/ble/:bleDisp/:userid', blelib.execBleDisp);

module.exports = routes;