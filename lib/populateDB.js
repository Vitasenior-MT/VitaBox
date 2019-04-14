'use strict'
var Remote = require('./models/remotes.js'),
  Board = require('./models/boards.js'),
  Patient = require('./models/patients.js'),
  RawSensors = require('./models/rawsensors.js'),
  Sensors = require('./models/sensors.js'),
  Setting = require('./models/settings.js'),
  numSensorSeeds = 500,
  numBioSeeds = 20;

RawSensors = new RawSensors();
Sensors = new Sensors();
Remote = new Remote();
Setting = new Setting();
Board = new Board();
Patient = new Patient();

var self = module.exports = {
  poulareDB: function (env_dev) {
    self.addRemoteCommands();
    if (env_dev) {
      self.addPatients();
      self.addSensors();
      self.addRawSensors();
      self.addRawSensoreBio();
    }
  },

  randomIntFromInterval: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  addRemoteCommands: function () {
    Remote.insertMany([
      { name: 'key_0', code: '20', task: 'none', timed_flg: true },
      { name: 'key_1', code: '21', task: 'channel', timed_flg: true },
      { name: 'key_2', code: '22', task: 'none', timed_flg: true },
      { name: 'key_3', code: '23', task: 'none', timed_flg: true },
      { name: 'key_4', code: '24', task: 'none', timed_flg: true },
      { name: 'key_5', code: '25', task: 'none', timed_flg: true },
      { name: 'key_6', code: '26', task: 'message', timed_flg: true },
      { name: 'key_7', code: '27', task: 'none', timed_flg: true },
      { name: 'key_8', code: '28', task: 'none', timed_flg: true },
      { name: 'key_9', code: '29', task: 'menu', timed_flg: true },
      { name: 'key_up', code: '1', task: 'up', timed_flg: true },
      { name: 'key_down', code: '2', task: 'down', timed_flg: true },
      { name: 'key_left', code: '3', task: 'left', timed_flg: true },
      { name: 'key_right', code: '4', task: 'right', timed_flg: true },
      { name: 'key_play', code: '44', task: 'none', timed_flg: true },
      { name: 'key_stop', code: '45', task: 'none', timed_flg: true },
      { name: 'key_pause', code: '46', task: 'none', timed_flg: true },
      { name: 'key_rewind', code: '48', task: 'none', timed_flg: true },
      { name: 'key_fastforward', code: '49', task: 'none', timed_flg: true },
      { name: 'key_exit', code: 'd', task: 'exit', timed_flg: true },
      { name: 'key_select', code: '0', task: 'ok_btn', timed_flg: true },
      { name: 'key_a', code: 'f2', task: 'none', timed_flg: true },
      { name: 'key_b', code: 'f3', task: 'none', timed_flg: true },
      { name: 'key_c', code: 'f4', task: 'none', timed_flg: true },
      { name: 'key_d', code: 'f1', task: 'none', timed_flg: true },
      { name: 'key_guide', code: '53', task: 'none', timed_flg: true },
      { name: 'key_p_up', code: '30', task: 'none', timed_flg: true },
      { name: 'key_p_down', code: '31', task: 'none', timed_flg: true },
      { name: 'key_pre_ch', code: '32', task: 'none', timed_flg: true },
      { name: 'key_green', code: 'green', task: 'settings', timed_flg: true }
    ]);
  },

  addPatients: function () {
    Patient.count(function () {
      Patient.insert([
        {
          id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
          birthdate: '1987-02-28',
          name: 'José António',
          gender: 'male',
          since: '2018-03-19',
          height: 1.75,
          weight: 75,
          Boards: [{
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            description: null,
            mac_addr: '50:8c:b1:6b:17:4f',
            Boardmodel: {
              id: "369aff29-f63e-434e-a83c-375518a491c3",
              type: "wearable",
              name: "Pressão Arterial",
              to_read: 'Pressão Arterial',
              unit: '',
              tag: 'bloodpressure',
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5-764f568cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'systolic',
                measure: 'Sistólica',
                to_read: 'Sistólica',
                unit: 'Sistólica',
                tag: 'systolic'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764f568cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'diastolic',
                measure: 'Diastólica',
                to_read: 'Diastólica',
                unit: '',
                tag: 'diastolic'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764f568cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'pulse',
                measure: 'Batimento Cardiaco',
                to_read: 'Batimento Cardiaco',
                unit: '',
                tag: 'pulse'
              }
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            description: null,
            mac_addr: '00:a0:50:04:26:2e',
            Boardmodel: {
              id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
              type: 'wearable',
              name: 'Pulso',
              to_read: 'Pulso',
              unit: '',
              tag: 'bodypulse',
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5-764f568cde41',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde41',
                transducer: 'spo2',
                measure: 'Oximetria',
                to_read: 'Oximetria',
                unit: '',
                tag: 'spo2'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764f568cdswf1',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cdswf1',
                transducer: 'pulse',
                measure: 'Batimento Cardiaco',
                to_read: 'Batimento Cardiaco',
                unit: '',
                tag: 'pulse'
              }
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            description: null,
            mac_addr: '8c:de:52:97:c0:34',
            Boardmodel: {
              id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
              type: 'bio',
              name: 'Balança',
              to_read: 'Balança',
              unit: '',
              tag: 'bodyscale'
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5-764f568cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'weight',
                measure: 'Peso',
                to_read: 'Peso',
                unit: '',
                tag: 'weight'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764f568sf48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568sf48',
                transducer: 'bodyfat',
                measure: 'bodyfat',
                to_read: 'bodyfat',
                unit: '',
                tag: 'bodyfat'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764sgg68cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764sgg68cde48',
                transducer: 'bonemass',
                measure: 'bonemass',
                to_read: 'bonemass',
                unit: '',
                tag: 'bonemass'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764sgdf8cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764sgdf8cde48',
                transducer: 'musclemass',
                measure: 'Massa Muscular',
                to_read: 'Massa Muscular',
                unit: '',
                tag: 'musclemass'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764wtw8cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764wtw8cde48',
                transducer: 'visceralfat',
                measure: 'Gordura Visceral',
                to_read: 'Gordura Visceral',
                unit: '',
                tag: 'visceralfat'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-wrtw68cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-wrtw68cde48',
                transducer: 'water',
                measure: 'Água',
                to_read: 'Água',
                unit: '',
                tag: 'water'
              }
            }, {
              id: '294a400c-e1e9-436e-b3etwrt568cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3etwrt568cde48',
                transducer: 'calories',
                measure: 'Calorias',
                to_read: 'Calorias',
                unit: '',
                tag: 'calories'
              }
            }]
          }]
        }, {
          id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
          birthdate: '1978-02-28',
          name: 'Manuel Freitas',
          gender: 'male',
          since: '2018-04-19',
          height: 1.85,
          weight: 90,
          Boards: [{
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            description: null,
            mac_addr: '50:8c:b1:6b:17:4f',
            Boardmodel: {
              id: "369aff29-f63e-434e-a83c-375518a491c3",
              type: "wearable",
              name: "Pressão Arterial",
              to_read: 'Pressão Arterial',
              unit: '',
              tag: 'bloodpressure'
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5-764fhgnjdde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764fhgnjdde48',
                transducer: 'systolic',
                measure: 'Sistólica',
                to_read: 'Sistólica',
                unit: '',
                tag: 'systolic'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764fshshgde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764fshshgde48',
                transducer: 'diastolic',
                measure: 'Diastólica',
                to_read: 'Diastólica',
                unit: '',
                tag: 'diastolic'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764fshwhacde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764fshwhacde48',
                transducer: 'pulse',
                measure: 'Batimento Cardiaco',
                to_read: 'Batimento Cardiaco',
                unit: '',
                tag: 'pulse'
              }
            }]
          }, {
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            description: null,
            mac_addr: 'a8:1b:6a:a9:07:b9',
            Boardmodel: {
              id: "369aff29-f63e-434e-a83c-375518a491c3",
              type: "wearable",
              name: "Temperatura",
              to_read: 'Temperatura',
              unit: '',
              tag: 'bodytemperature'
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5adf4f568cde41',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5adf4f568cde41',
                transducer: 'bodytemp',
                measure: 'Temperatura',
                to_read: 'Temperatura',
                unit: '',
                tag: 'bodytemp'
              }
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            description: null,
            mac_addr: '00:a0:50:04:26:2e',
            Boardmodel: {
              id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
              type: 'wearable',
              name: 'Pulsometro',
              to_read: 'Pulsometro',
              unit: '',
              tag: 'bodypulse'
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5-764f568cde41',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde41',
                transducer: 'spo2',
                measure: 'Oximetria',
                to_read: 'Oximetria',
                unit: '',
                tag: 'spo2'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-adfa568cde41',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-adfa568cde41',
                transducer: 'pulse',
                measure: 'Batimento Cardiaco',
                to_read: 'Batimento Cardiaco',
                unit: '',
                tag: 'pulse'
              }
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            description: null,
            mac_addr: '8c:de:52:97:c0:34',
            Boardmodel: {
              id: 'd6a24ae1-663c-4095-b3ee-08b7csd6cb',
              type: 'wearable',
              name: 'Pesar',
              to_read: 'wearable',
              unit: '',
              tag: 'bodyscale'
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5-764f568cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'weight',
                measure: 'Peso',
                to_read: 'Peso',
                unit: '',
                tag: 'weight'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
                transducer: 'bodyfat',
                measure: 'bodyfat',
                to_read: 'bodyfat',
                unit: '',
                tag: 'bodyfat'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
                transducer: 'bonemass',
                measure: 'bonemass',
                to_read: 'bonemass',
                unit: '',
                tag: 'bonemass'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
                transducer: 'musclemass',
                measure: 'Massa Muscular',
                to_read: 'Massa Muscular',
                unit: '',
                tag: 'musclemass'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
                transducer: 'visceralfat',
                measure: 'Gordura Visceral',
                to_read: 'Gordura Visceral',
                unit: '',
                tag: 'visceralfat'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
                transducer: 'water',
                measure: 'Água',
                to_read: 'Água',
                unit: '',
                tag: 'water'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5eryytynynde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5eryytynynde48',
                transducer: 'calories',
                measure: 'Calorias',
                to_read: 'Calorias',
                unit: '',
                tag: 'calories'
              }
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            description: null,
            mac_addr: 'fe:96:38:0c:74:79',
            Boardmodel: {
              id: 'd6a24ae1-663c-4095-b3ee-08b7cdsfv006cb',
              type: 'wearable',
              name: 'Mi Band',
              to_read: 'wearable',
              unit: '',
              tag: 'bandfitness'
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5eryyt234e48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5eryyt234e48',
                transducer: 'steps',
                measure: 'Passos',
                to_read: 'Passos',
                unit: '',
                tag: 'steps'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5wertyyyt234e48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5wertyyyt234e48',
                transducer: 'meters',
                measure: 'Metros',
                to_read: 'Metros',
                unit: '',
                tag: 'meters'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e646yt234e48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e646yt234e48',
                transducer: 'calories',
                measure: 'Calorias',
                to_read: 'Calorias',
                unit: '',
                tag: 'calories'
              }
            }, {
              id: '294a400c-e1e9-436e-b3e5w2465t234e48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5w2465t234e48',
                transducer: 'heartrate',
                measure: 'Batimento Cardíaco',
                to_read: 'Batimento Cardíaco',
                unit: '',
                tag: 'heartrate'
              }
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db789',
            description: null,
              mac_addr: '18:7a:93:09:e6:73',
            Boardmodel: {
              id: 'd6a24ae1-663c-4095-b3ee-08b7dkj900654',
              type: 'wearable',
              name: 'Medir Glicose',
              to_read: 'Medir Glicose',
              unit: '',
              tag: 'bloodglucose'
            },
            Sensors: [{
              id: '294a400c-e1e9-436e-b3e5-764f568cde48',
              Sensormodel: {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'bloodglucose',
                measure: 'Glucose',
                to_read: 'Glucose',
                unit: '',
                tag: 'bloodglucose'
              }
            }]
          }]
        }]);
    });
  },

  addSensors: function () {
    Sensors.countDataSensor(function () {
      Sensors.insertMany([
        {
          board_id: "1d7ebcad-16ee-4586-9e3e-798be9ed5291",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          node_id: "610d",
          sensortype: "temp",
          location: "Sala",
          measure: 'Temperatura',
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.933Z",
          critState: false,
          unit: "ºC",
          to_read: "ºC",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          board_id: "36a37975-d7dc-43dc-b96f-fd6fea576880",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          node_id: "60fb",
          sensortype: "temp",
          location: "Quarto",
          measure: 'Temperatura',
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.944Z",
          critState: false,
          unit: "ºC",
          to_read: "ºC",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          board_id: "36a37975-d7dc-43dc-b96f-fd6fea576880",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          node_id: "60fb",
          sensortype: "humi",
          location: "Quarto",
          measure: 'Humidade',
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.946Z",
          critState: false,
          unit: "%",
          to_read: "%",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          node_id: "b21a",
          sensortype: "temp",
          measure: 'Temperatura',
          location: "Cozinha",
          avg: 22.046,
          avgLastUpdate: "2018-05-08T16:11:36.866Z",
          critState: false,
          unit: "ºC",
          to_read: "ºC",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          node_id: "b21a",
          sensortype: "humi",
          location: "Cozinha",
          measure: 'Humidade',
          avg: 41.035000000000004,
          avgLastUpdate: "2018-05-08T16:11:36.864Z",
          critState: false,
          unit: "%",
          to_read: "%",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          board_id: "6e37cd31-b672-471b-a129-c484be8cf6b3",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          node_id: "2dc6",
          sensortype: "temp",
          location: "Quarto",
          measure: 'Temperatura',
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.953Z",
          critState: false,
          unit: "ºC",
          to_read: "ºC",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          board_id: "6e37cd31-b672-471b-a129-c484be8cf6b3",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          node_id: "2dc6",
          sensortype: "humi",
          location: "Quarto",
          measure: 'Humidade',
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.955Z",
          critState: false,
          unit: "%",
          to_read: "%",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          node_id: "2f26",
          sensortype: "temp",
          location: "Quarto",
          measure: 'Temperatura',
          avg: 22.048000000000005,
          avgLastUpdate: "2018-05-08T16:11:40.718Z",
          critState: false,
          unit: "ºC",
          to_read: "ºC",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          node_id: "2f26",
          sensortype: "humi",
          location: "Quarto",
          measure: 'Humidade',
          avg: 38.053000000000004,
          avgLastUpdate: "2018-05-08T16:11:40.711Z",
          critState: false,
          unit: "%",
          to_read: "%",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          node_id: "60c8",
          sensortype: "temp",
          location: "Cozinha",
          measure: 'Temperatura',
          avg: 22.03,
          avgLastUpdate: "2018-05-08T15:42:55.876Z",
          critState: false,
          unit: "ºC",
          to_read: "ºC",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          node_id: "60c8",
          sensortype: "humi",
          location: "Cozinha",
          measure: 'Humidade',
          avg: 61.08,
          avgLastUpdate: "2018-05-08T15:42:55.867Z",
          critState: true,
          unit: "%",
          to_read: "%",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23132",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce322",
          node_id: "60c8",
          sensortype: "co",
          location: "Cozinha",
          measure: 'CO',
          avg: 61.08,
          avgLastUpdate: "2018-05-08T15:42:55.867Z",
          critState: true,
          unit: "ppm",
          to_read: "ppm",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23123",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce333",
          node_id: "60c8",
          sensortype: "co2",
          location: "Cozinha",
          measure: 'CO2',
          avg: 61.08,
          avgLastUpdate: "2018-05-08T15:42:55.867Z",
          critState: true,
          unit: "ppm",
          to_read: "ppm",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        }
      ]);
    });
  },

  addRawSensors: function () {
    RawSensors.countRawSensors(function () {
      var sensorArr = [];
      var time = new Date().getTime() - (numSensorSeeds * 1000000);
      for (let index = 0; index < numSensorSeeds; index++) {
        time += 1000000;
        var d = new Date(time);
        sensorArr.push({
          id: "",
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: d,
          location: "Cozinha",
          transducer: "humi",
          measure: "Humidade",
          datetime: d,
          value: self.randomIntFromInterval(45, 50),
          flg_available: true
        }, {
            id: "",
            board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
            datetime: d,
            location: "Cozinha",
            transducer: "temp",
            measure: "Temperatura",
            datetime: d,
            value: self.randomIntFromInterval(20, 25),
            flg_available: true
          }, {
            id: "",
            board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
            datetime: d,
            location: "Quarto",
            transducer: "humi",
            measure: "Humidade",
            datetime: d,
            value: self.randomIntFromInterval(45, 50),
            flg_available: true
          }, {
            id: "",
            board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
            sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
            datetime: d,
            location: "Quarto",
            transducer: "temp",
            measure: "Temperatura",
            datetime: d,
            value: self.randomIntFromInterval(20, 25),
            flg_available: true
          }, {
            id: "",
            board_id: "1d7ebcad-16ee-4586-9e3e-798be9ed5291",
            sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
            datetime: d,
            location: "Sala",
            transducer: "temp",
            measure: "Temperatura",
            datetime: d,
            value: self.randomIntFromInterval(20, 25),
            flg_available: true
          }, {
            id: "",
            board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23132",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce322",
            datetime: d,
            location: "Cozinha",
            transducer: "co",
            measure: "CO",
            datetime: d,
            value: self.randomIntFromInterval(60, 65),
            flg_available: true
          }, {
            id: "",
            board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23123",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce333",
            datetime: d,
            location: "Cozinha",
            transducer: "co2",
            measure: "CO2",
            datetime: d,
            value: self.randomIntFromInterval(10, 13),
            flg_available: true
          });
      }
      RawSensors.insertMany(sensorArr);
    });
  },

  addRawSensoreBio: function () {
    RawSensors.countDataRawSensorBio(function () {
      var arrBio = [];
      var time = new Date().getTime() - (numBioSeeds * 100000000);
      for (let index = 0; index < numBioSeeds; index++) {
        time += 100000000;
        var d = new Date(time);
        arrBio.push({
          id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
          patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
          bio: true,
          board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
          sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'weight',
          measure: 'Peso',
          datetime: d,
          value: self.randomIntFromInterval(90, 92)
        }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
            transducer: 'bodyfat',
            measure: 'bodyfat',
            datetime: d,
            value: self.randomIntFromInterval(22, 28)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
            transducer: 'bonemass',
            measure: 'bonemass',
            datetime: d,
            value: self.randomIntFromInterval(2, 7)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
            transducer: 'musclemass',
            measure: 'Massa Muscular',
            datetime: d,
            value: self.randomIntFromInterval(60, 65)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
            transducer: 'visceralfat',
            measure: 'Gordura Visceral',
            datetime: d,
            value: self.randomIntFromInterval(13, 18)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
            transducer: 'water',
            measure: 'Água',
            datetime: d,
            value: self.randomIntFromInterval(55, 60)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5eryytynynde48',
            transducer: 'calories',
            measure: 'Calorias',
            datetime: d,
            value: self.randomIntFromInterval(1906, 2000)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-a8:1b:6a:a9:07:b9',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5adf4f568cde41',
            transducer: 'bodytemp',
            measure: 'Temperatura',
            datetime: d,
            value: self.randomIntFromInterval(29, 35)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-00:a0:50:04:26:2e',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde41',
            transducer: 'spo2',
            measure: 'Oximetria',
            datetime: d,
            value: self.randomIntFromInterval(47, 55)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-00:a0:50:04:26:2e',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-adfa568cde41',
            transducer: 'pulse',
            measure: 'Batimento Cardiaco',
            datetime: d,
            value: self.randomIntFromInterval(100, 110)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e5eryyt234e48',
            transducer: 'steps',
            measure: 'Passos',
            datetime: d,
            value: self.randomIntFromInterval(1000, 1500)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e5wertyyyt234e48',
            transducer: 'meters',
            measure: 'Metros',
            datetime: d,
            value: self.randomIntFromInterval(1000, 5000)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e646yt234e48',
            transducer: 'calories',
            measure: 'Calorias',
            datetime: d,
            value: self.randomIntFromInterval(1200, 1500)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e5w2465t234e48',
            transducer: 'heartrate',
            measure: 'Batimento Cardíaco',
            datetime: d,
            value: self.randomIntFromInterval(65, 75)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-50:8c:b1:6b:17:4f',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fhgnjdde48',
            transducer: 'systolic',
            measure: 'Sistólica',
            datetime: d,
            value: self.randomIntFromInterval(140, 160)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-50:8c:b1:6b:17:4f',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshshgde48',
            transducer: 'diastolic',
            measure: 'Diastólica',
            datetime: d,
            value: self.randomIntFromInterval(80, 95)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-50:8c:b1:6b:17:4f',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshwhacde48',
            transducer: 'pulse',
            measure: 'Batimento Cardiaco',
            datetime: d,
            value: self.randomIntFromInterval(65, 75)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-00:a0:50:04:26:2e',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde41',
            transducer: 'spo2',
            measure: 'Oximetria',
            datetime: d,
            value: self.randomIntFromInterval(47, 55)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-00:a0:50:04:26:2e',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-adfa568cde41',
            transducer: 'pulse',
            measure: 'Batimento Cardiaco',
            datetime: d,
            value: self.randomIntFromInterval(100, 110)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-50:8c:b1:6b:17:4f',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fhgnjdde48',
            transducer: 'systolic',
            measure: 'Sistólica',
            datetime: d,
            value: self.randomIntFromInterval(140, 160)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-50:8c:b1:6b:17:4f',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshshgde48',
            transducer: 'diastolic',
            measure: 'Diastólica',
            datetime: d,
            value: self.randomIntFromInterval(80, 95)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-50:8c:b1:6b:17:4f',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshwhacde48',
            transducer: 'pulse',
            measure: 'Batimento Cardiaco',
            datetime: d,
            value: self.randomIntFromInterval(65, 75)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde48',
            transducer: 'weight',
            measure: 'Peso',
            datetime: d,
            value: self.randomIntFromInterval(70, 72)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
            transducer: 'bodyfat',
            measure: 'bodyfat',
            datetime: d,
            value: self.randomIntFromInterval(22, 28)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
            transducer: 'bonemass',
            measure: 'bonemass',
            datetime: d,
            value: self.randomIntFromInterval(2, 7)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
            transducer: 'musclemass',
            measure: 'Massa Muscular',
            datetime: d,
            value: self.randomIntFromInterval(60, 65)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
            transducer: 'visceralfat',
            measure: 'Gordura Visceral',
            datetime: d,
            value: self.randomIntFromInterval(13, 18)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
            transducer: 'water',
            measure: 'Água',
            datetime: d,
            value: self.randomIntFromInterval(55, 60)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5eryytynynde48',
            transducer: 'calories',
            measure: 'Calorias',
            datetime: d,
            value: self.randomIntFromInterval(1906, 2000)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde48',
            transducer: 'weight',
            measure: 'Peso',
            datetime: d,
            value: self.randomIntFromInterval(70, 72)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
            transducer: 'bodyfat',
            measure: 'bodyfat',
            datetime: d,
            value: self.randomIntFromInterval(22, 28)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
            transducer: 'bonemass',
            measure: 'bonemass',
            datetime: d,
            value: self.randomIntFromInterval(2, 7)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
            transducer: 'musclemass',
            measure: 'Massa Muscular',
            datetime: d,
            value: self.randomIntFromInterval(60, 65)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
            transducer: 'visceralfat',
            measure: 'Gordura Visceral',
            datetime: d,
            value: self.randomIntFromInterval(13, 18)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
            transducer: 'water',
            measure: 'Água',
            datetime: d,
            value: self.randomIntFromInterval(55, 60)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            patient_id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5eryytynynde48',
            transducer: 'calories',
            measure: 'Calorias',
            datetime: d,
            value: self.randomIntFromInterval(1906, 2000)
          });
      }
      RawSensors.insertMany(arrBio);
    });
  }
}
