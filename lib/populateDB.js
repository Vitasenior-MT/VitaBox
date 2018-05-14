'use strict'
var Remote = require('./models/remotes.js'),
  Board = require('./models/boards.js'),
  Patient = require('./models/patients.js'),
  RawSensors = require('./models/rawsensors.js'),
  Sensors = require('./models/sensors.js'),
  Setting = require('./models/settings.js'),
  numSensorSeeds = 100,
  numBioSeeds = 15;

RawSensors = new RawSensors();
Sensors = new Sensors();
Remote = new Remote();
Setting = new Setting();
Board = new Board();
Patient = new Patient();

var self = module.exports = {
  poulareDB: function () {
    self.addRemoteCommands();
    self.addPatients();
    self.addSensors();
    self.addRawSensors();
    self.addRawSensoreBio();
  },

  randomIntFromInterval: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  addRemoteCommands: function () {
    Remote.countRemoteCmd(function () {
      Remote.insertAllRemoteCmd([
        { name: 'key_0', code: '20', task: 'none', timed_flg: false },
        { name: 'key_1', code: '21', task: 'ch_1', timed_flg: true },
        { name: 'key_2', code: '22', task: 'ch_2', timed_flg: true },
        { name: 'key_3', code: '23', task: 'hdmirequest', timed_flg: true },
        { name: 'key_4', code: '24', task: 'var_state', timed_flg: true },
        { name: 'key_5', code: '25', task: 'none', timed_flg: false },
        { name: 'key_6', code: '26', task: 'none', timed_flg: false },
        { name: 'key_7', code: '27', task: 'none', timed_flg: false },
        { name: 'key_8', code: '28', task: 'none', timed_flg: false },
        { name: 'key_9', code: '29', task: 'menu', timed_flg: false },
        { name: 'key_up', code: '1', task: 'up', timed_flg: false },
        { name: 'key_down', code: '2', task: 'down', timed_flg: false },
        { name: 'key_left', code: '3', task: 'left', timed_flg: false },
        { name: 'key_right', code: '4', task: 'right', timed_flg: false },
        { name: 'key_play', code: '44', task: 'none', timed_flg: false },
        { name: 'key_stop', code: '45', task: 'none', timed_flg: false },
        { name: 'key_pause', code: '46', task: 'none', timed_flg: false },
        { name: 'key_rewind', code: '48', task: 'none', timed_flg: false },
        { name: 'key_fastforward', code: '49', task: 'none', timed_flg: false },
        { name: 'key_exit', code: 'd', task: 'exit', timed_flg: false },
        { name: 'key_select', code: '0', task: 'ok_btn', timed_flg: false },
        { name: 'key_a', code: 'f2', task: 'none', timed_flg: false },
        { name: 'key_b', code: 'f3', task: 'none', timed_flg: false },
        { name: 'key_c', code: 'f4', task: 'none', timed_flg: false },
        { name: 'key_d', code: 'f1', task: 'none', timed_flg: false },
        { name: 'key_guide', code: '53', task: 'none', timed_flg: false },
        { name: 'key_p_up', code: '30', task: 'none', timed_flg: false },
        { name: 'key_p_down', code: '31', task: 'none', timed_flg: false },
        { name: 'key_pre_ch', code: '32', task: 'none', timed_flg: false }
      ]);
    });
  },

  addPatients: function () {
    Patient.count(function () {
      Patient.insert({
        patients: [{
          id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
          birthdate: '1987-02-28',
          name: 'José António',
          gender: 'male',
          since: '2018-03-19',
          height: 1.75,
          weight: 75,
          Boards: [{
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            location: null,
            mac_addr: '50:8c:b1:6b:17:4f',
            Boardmodel: {
              id: "369aff29-f63e-434e-a83c-375518a491c3",
              type: "wearable",
              name: "Medir Pressão Arterial",
              tag: 'bloodpressure',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'systolic',
                measure: 'maxima',
                tag: 'maxima'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'diastolic',
                measure: 'minima',
                tag: 'minima'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'pulse',
                measure: 'pulso',
                tag: 'pulso'
              }]
            }
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            location: null,
            node_id: '60c2',
            updated_at: '2018-04-23',
            mac_addr: '00:a0:50:04:26:2e',
            Boardmodel: [{
              id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
              type: 'bio',
              name: 'bodypulse',
              tag: 'bodypulse',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5-764f568cde41',
                transducer: 'spo2',
                measure: 'oxigenio',
                tag: 'spo2'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764f568cdswf1',
                transducer: 'pulse',
                measure: 'pulso',
                tag: 'pulse'
              }]
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            location: null,
            node_id: '60c3',
            updated_at: '2018-04-23',
            mac_addr: '8c:de:52:97:c0:34',
            Boardmodel: [{
              id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
              type: 'bio',
              name: 'bodyscale',
              tag: 'bodyscale',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'weight',
                measure: 'altura',
                tag: 'altura'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764f568sf48',
                transducer: 'bodyfat',
                measure: 'bodyfat',
                tag: 'bodyfat'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764sgg68cde48',
                transducer: 'bonemass',
                measure: 'bonemass',
                tag: 'bonemass'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764sgdf8cde48',
                transducer: 'musclemass',
                measure: 'musclemass',
                tag: 'musclemass'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764wtw8cde48',
                transducer: 'visceralfat',
                measure: 'visceralfat',
                tag: 'visceralfat'
              }, {
                id: '294a400c-e1e9-436e-b3e5-wrtw68cde48',
                transducer: 'water',
                measure: 'water',
                tag: 'water'
              }, {
                id: '294a400c-e1e9-436e-b3etwrt568cde48',
                transducer: 'calories',
                measure: 'calories',
                tag: 'calories'
              }]
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
            location: null,
            mac_addr: '50:8c:b1:6b:17:4f',
            Boardmodel: {
              id: "369aff29-f63e-434e-a83c-375518a491c3",
              type: "wearable",
              name: "Medir Pressão Arterial",
              tag: 'bloodpressure',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5-764fhgnjdde48',
                transducer: 'systolic',
                measure: 'maxima',
                tag: 'systolic'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764fshshgde48',
                transducer: 'diastolic',
                measure: 'minima',
                tag: 'diastolic'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764fshwhacde48',
                transducer: 'pulse',
                measure: 'pulso',
                tag: 'pulse'
              }]
            }
          }, {
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            location: null,
            mac_addr: 'a8:1b:6a:a9:07:b9',
            Boardmodel: {
              id: "369aff29-f63e-434e-a83c-375518a491c3",
              type: "wearable",
              name: "Medir temperatura",
              tag: 'bodytemperature',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5adf4f568cde41',
                transducer: 'temp',
                measure: 'temperatura',
                tag: 'temperatura'
              }]
            }
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            location: null,
            node_id: '60c2',
            updated_at: '2018-04-23',
            mac_addr: '00:a0:50:04:26:2e',
            Boardmodel: [{
              id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
              type: 'wearable',
              name: 'Pulsiometro',
              tag: 'bodypulse',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5-764f568cde41',
                transducer: 'spo2',
                measure: 'oxigenio',
                tag: 'spo2'
              }, {
                id: '294a400c-e1e9-436e-b3e5-adfa568cde41',
                transducer: 'pulse',
                measure: 'pulso',
                tag: 'pulse'
              }]
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            location: null,
            node_id: '60c3',
            updated_at: '2018-04-23',
            mac_addr: '8c:de:52:97:c0:34',
            Boardmodel: [{
              id: 'd6a24ae1-663c-4095-b3ee-08b7csd6cb',
              type: 'wearable',
              name: 'bodyscale',
              tag: 'bodyscale',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'weight',
                measure: 'altura',
                tag: 'altura'
              }, {
                id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
                transducer: 'bodyfat',
                measure: 'bodyfat',
                tag: 'bodyfat'
              }, {
                id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
                transducer: 'bonemass',
                measure: 'bonemass',
                tag: 'bonemass'
              }, {
                id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
                transducer: 'musclemass',
                measure: 'musclemass',
                tag: 'musclemass'
              }, {
                id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
                transducer: 'visceralfat',
                measure: 'visceralfat',
                tag: 'visceralfat'
              }, {
                id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
                transducer: 'water',
                measure: 'water',
                tag: 'water'
              }, {
                id: '294a400c-e1e9-436e-b3e5eryytynynde48',
                transducer: 'calories',
                measure: 'calories',
                tag: 'calories'
              }]
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            location: null,
            node_id: '60c3',
            updated_at: '2018-04-23',
            mac_addr: 'fe:96:38:0c:74:79',
            Boardmodel: [{
              id: 'd6a24ae1-663c-4095-b3ee-08b7cdsfv006cb',
              type: 'wearable',
              name: 'bandfitness',
              tag: 'bandfitness',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5eryyt234e48',
                transducer: 'steps',
                measure: 'steps',
                tag: 'steps'
              }, {
                id: '294a400c-e1e9-436e-b3e5wertyyyt234e48',
                transducer: 'meters',
                measure: 'meters',
                tag: 'meters'
              }, {
                id: '294a400c-e1e9-436e-b3e646yt234e48',
                transducer: 'callories',
                measure: 'callories',
                tag: 'callories'
              }, {
                id: '294a400c-e1e9-436e-b3e5w2465t234e48',
                transducer: 'heartrate',
                measure: 'heartrate',
                tag: 'heartrate'
              }]
            }]
          }, {
            id: 'da99ebb6-7d4f-43da-ac02-52076ed4db789',
            location: null,
            node_id: '60c3',
            updated_at: '2018-04-23',
            mac_addr: 'rr:rr:rr:rr:rr',
            Boardmodel: [{
              id: 'd6a24ae1-663c-4095-b3ee-08b7dkj900654',
              type: 'wearable',
              name: 'bloodglucose',
              tag: 'bloodglucose',
              Sensors: []
            }]
          }]
        }]
      });
    });
  },

  addSensors: function () {
    Sensors.countDataSensor(function () {
      Sensors.insertMany([
        {
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.933Z",
          board_id: "1d7ebcad-16ee-4586-9e3e-798be9ed5291",
          critLevel: 0,
          location: "hall",
          node_id: "610d",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          sensortype: "temp",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.944Z",
          board_id: "36a37975-d7dc-43dc-b96f-fd6fea576880",
          critLevel: 0,
          location: "bedroom",
          node_id: "60fb",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          sensortype: "temp",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.946Z",
          board_id: "36a37975-d7dc-43dc-b96f-fd6fea576880",
          critLevel: 0,
          location: "bedroom",
          node_id: "60fb",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          sensortype: "humi",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          avg: 22.046,
          avgLastUpdate: "2018-05-08T16:11:36.866Z",
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          critLevel: 0,
          location: "kitchen",
          node_id: "b21a",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          sensortype: "temp",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          avg: 41.035000000000004,
          avgLastUpdate: "2018-05-08T16:11:36.864Z",
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          critLevel: 0,
          location: "kitchen",
          node_id: "b21a",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          sensortype: "humi",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.953Z",
          board_id: "6e37cd31-b672-471b-a129-c484be8cf6b3",
          critLevel: 0,
          location: "bedroom",
          node_id: "2dc6",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          sensortype: "temp",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          avg: 0,
          avgLastUpdate: "2018-05-08T10:52:18.955Z",
          board_id: "6e37cd31-b672-471b-a129-c484be8cf6b3",
          critLevel: 0,
          location: "bedroom",
          node_id: "2dc6",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          sensortype: "humi",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          avg: 22.048000000000005,
          avgLastUpdate: "2018-05-08T16:11:40.718Z",
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          critLevel: 0,
          location: "bedroom",
          node_id: "2f26",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          sensortype: "temp",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          avg: 38.053000000000004,
          avgLastUpdate: "2018-05-08T16:11:40.711Z",
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          critLevel: 0,
          location: "bedroom",
          node_id: "2f26",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          sensortype: "humi",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          avg: 22.03,
          avgLastUpdate: "2018-05-08T15:42:55.876Z",
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          critLevel: 0,
          location: "kitchen",
          node_id: "60c8",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          sensortype: "temp",
          threshold_max_acceptable: 25,
          threshold_max_possible: 50,
          threshold_min_acceptable: 10,
          threshold_min_possible: -20
        },
        {
          avg: 61.08,
          avgLastUpdate: "2018-05-08T15:42:55.867Z",
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          critLevel: 2,
          location: "kitchen",
          node_id: "60c8",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          sensortype: "humi",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          avg: 61.08,
          avgLastUpdate: "2018-05-08T15:42:55.867Z",
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23132",
          critLevel: 2,
          location: "kitchen",
          node_id: "60c8",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce322",
          sensortype: "co",
          threshold_max_acceptable: 50,
          threshold_max_possible: 60,
          threshold_min_acceptable: 30,
          threshold_min_possible: 20
        },
        {
          avg: 61.08,
          avgLastUpdate: "2018-05-08T15:42:55.867Z",
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23123",
          critLevel: 2,
          location: "kitchen",
          node_id: "60c8",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce333",
          sensortype: "co2",
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
      var time = new Date().getTime() - (numSensorSeeds * 100000);
      for (let index = 0; index < numSensorSeeds; index++) {
        time += 100000;
        var d = new Date(time);
        sensorArr.push({
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: d,
          location: "kitchen",
          transducer: "humi",
          value: self.randomIntFromInterval(45, 50),
          flg_available: true
        }, {
            board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
            datetime: d,
            location: "kitchen",
            transducer: "temp",
            value: self.randomIntFromInterval(20, 25),
            flg_available: true
          }, {
            board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
            datetime: d,
            location: "bedroom",
            transducer: "humi",
            value: self.randomIntFromInterval(45, 50),
            flg_available: true
          }, {
            board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
            sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
            datetime: d,
            location: "bedroom",
            transducer: "temp",
            value: self.randomIntFromInterval(20, 25),
            flg_available: true
          }, {
            board_id: "1d7ebcad-16ee-4586-9e3e-798be9ed5291",
            sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
            datetime: d,
            location: "hall",
            transducer: "temp",
            value: self.randomIntFromInterval(20, 25),
            flg_available: true
          }, {
            board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23132",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce322",
            datetime: d,
            location: "kitchen",
            transducer: "co",
            value: self.randomIntFromInterval(60, 65),
            flg_available: true
          }, {
            board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23123",
            sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce333",
            datetime: d,
            location: "kitchen",
            transducer: "co2",
            value: self.randomIntFromInterval(10, 13),
            flg_available: true
          });
      }
      RawSensors.insertMany(sensorArr);
      /*
      RawSensors.insertMany([
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:28.888Z",
          location: "kitchen",
          transducer: "humi",
          value: 42.08,
          flg_available: true
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:28.888Z",
          location: "kitchen",
          transducer: "temp",
          value: 23.01,
          flg_available: true
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:34.388Z",
          location: "kitchen",
          transducer: "humi",
          value: 42.09,
          flg_available: true
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:34.389Z",
          location: "kitchen",
          transducer: "temp",
          value: 23.01,
          flg_available: true
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:40.380Z",
          location: "kitchen",
          transducer: "humi",
          value: 42.08,
          flg_available: true
        },
        {
          board_id: "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:40.381Z",
          location: "kitchen",
          transducer: "temp",
          value: 23.01,
          flg_available: true
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:32.044Z",
          location: "kitchen",
          transducer: "humi",
          value: 61,
          flg_available: true
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:32.045Z",
          location: "kitchen",
          transducer: "temp",
          value: 24.01,
          flg_available: true
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:37.263Z",
          location: "kitchen",
          transducer: "humi",
          value: 60.09,
          flg_available: true
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:37.264Z",
          location: "kitchen",
          transducer: "temp",
          value: 24,
          flg_available: true
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:42.521Z",
          location: "kitchen",
          transducer: "humi",
          value: 60.09,
          flg_available: true
        },
        {
          board_id: "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:42.522Z",
          location: "kitchen",
          transducer: "temp",
          value: 24,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:29.044Z",
          location: "bedroom",
          transducer: "humi",
          value: 38.07,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:29.045Z",
          location: "bedroom",
          transducer: "temp",
          value: 23.06,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:33.834Z",
          location: "bedroom",
          transducer: "humi",
          value: 38.06,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:33.835Z",
          location: "bedroom",
          transducer: "temp",
          value: 23.06,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:39.849Z",
          location: "bedroom",
          transducer: "humi",
          value: 38.04,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:39.850Z",
          location: "bedroom",
          transducer: "temp",
          value: 23.06,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "aeed1a8e-6154-476d-be8f-8cfd346ce317",
          datetime: "2018-05-08T10:52:44.841Z",
          location: "bedroom",
          transducer: "humi",
          value: 38.02,
          flg_available: true
        },
        {
          board_id: "942a41ac-2708-4933-9424-c848c6f0c868",
          sensor_id: "a149d781-5a4f-4d92-be6e-c713422748cd",
          datetime: "2018-05-08T10:52:44.842Z",
          location: "bedroom",
          transducer: "temp",
          value: 23.06,
          flg_available: true
        }
      ]);*/
    });
  },

  addRawSensoreBio: function () {
    RawSensors.countDataRawSensorBio(function () {
      var arrBio = [];
      var time = new Date().getTime() - (numBioSeeds * 10000000);
      for (let index = 0; index < numBioSeeds; index++) {
        time += 10000000;
        var d = new Date(time);
        arrBio.push({
          id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
          bio: true,
          board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
          sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'weight',
          datetime: d,
          value: self.randomIntFromInterval(90, 92)
        }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
            transducer: 'bodyfat',
            datetime: d,
            value: self.randomIntFromInterval(22, 28)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
            transducer: 'bonemass',
            datetime: d,
            value: self.randomIntFromInterval(2, 7)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
            transducer: 'musclemass',
            datetime: d,
            value: self.randomIntFromInterval(60, 65)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
            transducer: 'visceralfat',
            datetime: d,
            value: self.randomIntFromInterval(13, 18)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
            transducer: 'water',
            datetime: d,
            value: self.randomIntFromInterval(55, 60)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5eryytynynde48',
            transducer: 'calories',
            datetime: d,
            value: self.randomIntFromInterval(1906, 2000)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-a8:1b:6a:a9:07:b9',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5adf4f568cde41',
            transducer: 'temp',
            datetime: d,
            value: self.randomIntFromInterval(29, 35)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-00:a0:50:04:26:2e',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde41',
            transducer: 'spo2',
            datetime: d,
            value: self.randomIntFromInterval(47, 55)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-00:a0:50:04:26:2e',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-adfa568cde41',
            transducer: 'pulse',
            datetime: d,
            value: self.randomIntFromInterval(100, 110)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e5eryyt234e48',
            transducer: 'steps',
            datetime: d,
            value: self.randomIntFromInterval(1000, 1500)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e5wertyyyt234e48',
            transducer: 'meters',
            datetime: d,
            value: self.randomIntFromInterval(1000, 5000)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e646yt234e48',
            transducer: 'callories',
            datetime: d,
            value: self.randomIntFromInterval(1200, 1500)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-fe:96:38:0c:74:79',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db766',
            sensor_id: '294a400c-e1e9-436e-b3e5w2465t234e48',
            transducer: 'heartrate',
            datetime: d,
            value: self.randomIntFromInterval(65, 75)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-50:8c:b1:6b:17:4f',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fhgnjdde48',
            transducer: 'systolic',
            datetime: d,
            value: self.randomIntFromInterval(140, 160)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-50:8c:b1:6b:17:4f',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshshgde48',
            transducer: 'diastolic',
            datetime: d,
            value: self.randomIntFromInterval(80, 95)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715dd-50:8c:b1:6b:17:4f',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshwhacde48',
            transducer: 'pulse',
            datetime: d,
            value: self.randomIntFromInterval(65, 75)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-00:a0:50:04:26:2e',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde41',
            transducer: 'spo2',
            datetime: d,
            value: self.randomIntFromInterval(47, 55)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-00:a0:50:04:26:2e',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
            sensor_id: '294a400c-e1e9-436e-b3e5-adfa568cde41',
            transducer: 'pulse',
            datetime: d,
            value: self.randomIntFromInterval(100, 110)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-50:8c:b1:6b:17:4f',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fhgnjdde48',
            transducer: 'systolic',
            datetime: d,
            value: self.randomIntFromInterval(140, 160)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-50:8c:b1:6b:17:4f',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshshgde48',
            transducer: 'diastolic',
            datetime: d,
            value: self.randomIntFromInterval(80, 95)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-50:8c:b1:6b:17:4f',
            bio: true,
            board_id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006pp',
            sensor_id: '294a400c-e1e9-436e-b3e5-764fshwhacde48',
            transducer: 'pulse',
            datetime: d,
            value: self.randomIntFromInterval(65, 75)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde48',
            transducer: 'weight',
            datetime: d,
            value: self.randomIntFromInterval(70, 72)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
            transducer: 'bodyfat',
            datetime: d,
            value: self.randomIntFromInterval(22, 28)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
            transducer: 'bonemass',
            datetime: d,
            value: self.randomIntFromInterval(2, 7)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
            transducer: 'musclemass',
            datetime: d,
            value: self.randomIntFromInterval(60, 65)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
            transducer: 'visceralfat',
            datetime: d,
            value: self.randomIntFromInterval(13, 18)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
            transducer: 'water',
            datetime: d,
            value: self.randomIntFromInterval(55, 60)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5eryytynynde48',
            transducer: 'calories',
            datetime: d,
            value: self.randomIntFromInterval(1906, 2000)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764f568cde48',
            transducer: 'weight',
            datetime: d,
            value: self.randomIntFromInterval(70, 72)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-afaaf68cde48',
            transducer: 'bodyfat',
            datetime: d,
            value: self.randomIntFromInterval(22, 28)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76dfhsfh8cde48',
            transducer: 'bonemass',
            datetime: d,
            value: self.randomIntFromInterval(2, 7)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-7qtqwtcde48',
            transducer: 'musclemass',
            datetime: d,
            value: self.randomIntFromInterval(60, 65)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-764ffmm8cde48',
            transducer: 'visceralfat',
            datetime: d,
            value: self.randomIntFromInterval(13, 18)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5-76eryfnncde48',
            transducer: 'water',
            datetime: d,
            value: self.randomIntFromInterval(55, 60)
          }, {
            id: '02d3468c-d8b7-4895-a678-71f2efa715d1-8c:de:52:97:c0:34',
            bio: true,
            board_id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
            sensor_id: '294a400c-e1e9-436e-b3e5eryytynynde48',
            transducer: 'calories',
            datetime: d,
            value: self.randomIntFromInterval(1906, 2000)
          });
      }
      RawSensors.insertMany(arrBio);
    });
  }
}
