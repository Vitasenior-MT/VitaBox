var routes = require('express').Router(),
    connectServerlib = require('./connectServerlib.js'),
    sensorlib = require('./sensorlib.js'),
    rawsensorlib = require('./rawsensorlib.js'),
    patientslib = require('./patientslib.js'),
    blelib = require('./blelib.js');

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
routes.get("/api/sensor/getDistictAll", sensorlib.getDistictAll);

/*routes.post("/api/postSensorData", connectServerlib.postSensorData);
routes.get('/api/sensors/places/all', sensorlib.getPlaceSensores);
routes.get("/api/sensor/allSensorsInfo", sensorlib.getAllSensoresInfo);
routes.get('/api/sensors/:place/:sensor', sensorlib.getAllDataFromSensor);
routes.get('/api/getSensorData24', sensorlib.getSensorData24);*/

//Rawsensors
routes.get('/api/getSensorData', rawsensorlib.getSensorData);
routes.get('/api/raqsensor/getdata/:type', rawsensorlib.getSensorDataByType);
routes.get('/api/sensorsble/:id/:limit', rawsensorlib.getSensorsbleIdAllData);

//Boards
routes.get("/api/getBoards", connectServerlib.getBoards);

//Patients
routes.get("/api/getPatients", connectServerlib.getPatients);
routes.get("/api/patient/getAll", patientslib.getData);
routes.get("/api/patient/exames/:userid", patientslib.getUserExams);


// Dispositivos Bluetooth
routes.get('/api/ble/:bleDisp/:userid', blelib.execBleDisp);

module.exports = routes;

process.on("message", function (data) {
    console.log('routes');
    console.log('data');
    console.log(data);
    if (data.node_object) {
        sensorlib.getByNodeId(data.node_object.node_id, (result) => {
            console.log('result');
            console.log('result');
            console.log(result);
            process.send({ node_id: data.node_object.node_id, remote: data.node_object.remote, result: result });
        });
    }
});