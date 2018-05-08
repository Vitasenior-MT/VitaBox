'use strict'
var Remote = require('./models/remotes.js'),
  Board = require('./models/boards.js'),
  Patient = require('./models/patients.js'),
  RawSensors = require('./models/rawsensors.js'),
  Sensors = require('./models/sensors.js'),
  Setting = require('./models/settings.js');

RawSensors = new RawSensors();
Sensors = new Sensors();
Remote = new Remote();
Setting = new Setting();
Board = new Board();
Patient = new Patient();

var self = module.exports = {
  poulareDB: function () {
    self.addRemoteCommands();
    // self.addBio();
    self.addPatients();
    self.addRawSensors();
    self.addSensors();
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

  addBio: function () {
    Board.insert([{
      id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
      location: null,
      node_id: '60c0',
      updated_at: '2018-04-23',
      mac_addr: '50:8c:b1:6b:17:4f',
      Boardmodel: [{
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
        type: 'bio',
        name: 'bloodpressure',
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
      }]
    }, {
      id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
      location: null,
      node_id: '60c1',
      updated_at: '2018-04-23',
      mac_addr: 'a8:1b:6a:a9:07:b9',
      Boardmodel: [{
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
        type: 'bio',
        name: 'bodytemperature',
        Sensors: [{
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'battery',
          measure: 'bateria',
          tag: 'bateria'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'temp',
          measure: 'temperatura',
          tag: 'temperatura'
        }]
      }]
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
        Sensors: [{
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'spo2',
          measure: 'oxigenio',
          tag: 'oxigenio'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'pulse',
          measure: 'pulso',
          tag: 'pulso'
        }]
      }]
    }, {
      id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
      location: null,
      node_id: '60c3',
      updated_at: '2018-04-23',
      mac_addr: '8c:de:52:97:c0:34',
      Boardmodel: [{
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
        type: 'bio',
        name: 'bodyscale',
        Sensors: [{
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'weight',
          measure: 'altura',
          tag: 'altura'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'bodyfat',
          measure: 'bodyfat',
          tag: 'bodyfat'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'bonemass',
          measure: 'bonemass',
          tag: 'bonemass'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'musclemass',
          measure: 'musclemass',
          tag: 'musclemass'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'visceralfat',
          measure: 'visceralfat',
          tag: 'visceralfat'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'water',
          measure: 'water',
          tag: 'water'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
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
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
        type: 'bio',
        name: 'bandfitness',
        Sensors: [/*{
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'weight',
          measure: 'altura'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'bodyfat',
          measure: 'bodyfat'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'bonemass',
          measure: 'bonemass'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'musclemass',
          measure: 'musclemass'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'visceralfat',
          measure: 'visceralfat'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'water',
          measure: 'water'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'calories',
          measure: 'calories'
        }*/]
      }]
    }]);
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
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
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
              id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
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
          birthdate: '1972-02-28',
          name: 'Manuela Antonieta',
          gender: 'female',
          since: '2018-04-19',
          height: 1.55,
          weight: 65,
          Boards: [{
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
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
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
            location: null,
            mac_addr: 'a8:1b:6a:a9:07:b9',
            Boardmodel: {
              id: "369aff29-f63e-434e-a83c-375518a491c3",
              type: "wearable",
              name: "Medir temperatura",
              tag: 'bodytemperature',
              Sensors: [{
                id: '294a400c-e1e9-436e-b3e5-76aafa8cde41',
                transducer: 'battery',
                measure: 'bateria',
                tag: 'bateria'
              }, {
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
              Sensors: []
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

  addRawSensors: function () {
    RawSensors.countRawSensors(function () {
      RawSensors.insertMany([
        { "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:28.888Z", "value": 42.08, "_id": "5af1816ca4cc4964d4a6c6c4", "flg_available": true },
        { "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:28.888Z", "value": 23.01, "_id": "5af1816ca4cc4964d4a6c6c5", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:29.044Z", "value": 38.07, "_id": "5af1816da4cc4964d4a6c6c6", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:29.045Z", "value": 23.06, "_id": "5af1816da4cc4964d4a6c6c7", "flg_available": true },
        { "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:32.044Z", "value": 61, "_id": "5af18170a4cc4964d4a6c6c8", "flg_available": true },
        { "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:32.045Z", "value": 24.01, "_id": "5af18170a4cc4964d4a6c6c9", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:33.834Z", "value": 38.06, "_id": "5af18171a4cc4964d4a6c6ca", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:33.835Z", "value": 23.06, "_id": "5af18171a4cc4964d4a6c6cb", "flg_available": true },
        { "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:34.388Z", "value": 42.09, "_id": "5af18172a4cc4964d4a6c6cc", "flg_available": true },
        { "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:34.389Z", "value": 23.01, "_id": "5af18172a4cc4964d4a6c6cd", "flg_available": true },
        { "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:37.263Z", "value": 60.09, "_id": "5af18175a4cc4964d4a6c6ce", "flg_available": true },
        { "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:37.264Z", "value": 24, "_id": "5af18175a4cc4964d4a6c6cf", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:39.849Z", "value": 38.04, "_id": "5af18177a4cc4964d4a6c6d0", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:39.850Z", "value": 23.06, "_id": "5af18177a4cc4964d4a6c6d1", "flg_available": true },
        { "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:40.380Z", "value": 42.08, "_id": "5af18178a4cc4964d4a6c6d2", "flg_available": true },
        { "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:40.381Z", "value": 23.01, "_id": "5af18178a4cc4964d4a6c6d3", "flg_available": true },
        { "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:42.521Z", "value": 60.09, "_id": "5af1817aa4cc4964d4a6c6d4", "flg_available": true },
        { "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:42.522Z", "value": 24, "_id": "5af1817aa4cc4964d4a6c6d5", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "datetime": "2018-05-08T10:52:44.841Z", "value": 38.02, "_id": "5af1817ca4cc4964d4a6c6d6", "flg_available": true },
        { "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "datetime": "2018-05-08T10:52:44.842Z", "value": 23.06, "_id": "5af1817ca4cc4964d4a6c6d7", "flg_available": true }
      ]);
    });
  },

  addSensors: function () {
    Sensors.countDataSensor(function () {
      Sensors.insertMany([
        { "_id": "5af1816264000b7616077807", "avg": 0, "avgLastUpdate": "2018-05-08T10:52:18.933Z", "board_id": "1d7ebcad-16ee-4586-9e3e-798be9ed5291", "critLevel": 0, "location": "bedroom", "node_id": "610d", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "sensortype": "temp", "threshold_max_acceptable": 25, "threshold_max_possible": 50, "threshold_min_acceptable": 10, "threshold_min_possible": -20 },
        { "_id": "5af1816264000b7616077808", "avg": 0, "avgLastUpdate": "2018-05-08T10:52:18.944Z", "board_id": "36a37975-d7dc-43dc-b96f-fd6fea576880", "critLevel": 0, "location": "bedroom", "node_id": "60fb", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "sensortype": "temp", "threshold_max_acceptable": 25, "threshold_max_possible": 50, "threshold_min_acceptable": 10, "threshold_min_possible": -20 },
        { "_id": "5af1816264000b7616077809", "avg": 0, "avgLastUpdate": "2018-05-08T10:52:18.941Z", "board_id": "1d7ebcad-16ee-4586-9e3e-798be9ed5291", "critLevel": 0, "location": "bedroom", "node_id": "610d", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "sensortype": "humi", "threshold_max_acceptable": 50, "threshold_max_possible": 60, "threshold_min_acceptable": 30, "threshold_min_possible": 20 },
        { "_id": "5af1816264000b761607780a", "avg": 0, "avgLastUpdate": "2018-05-08T10:52:18.946Z", "board_id": "36a37975-d7dc-43dc-b96f-fd6fea576880", "critLevel": 0, "location": "bedroom", "node_id": "60fb", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "sensortype": "humi", "threshold_max_acceptable": 50, "threshold_max_possible": 60, "threshold_min_acceptable": 30, "threshold_min_possible": 20 },
        { "_id": "5af1816264000b761607780b", "avg": 22.046, "avgLastUpdate": "2018-05-08T16:11:36.866Z", "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "critLevel": 0, "location": "kitchen", "node_id": "b21a", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "sensortype": "temp", "threshold_max_acceptable": 25, "threshold_max_possible": 50, "threshold_min_acceptable": 10, "threshold_min_possible": -20 },
        { "_id": "5af1816264000b761607780c", "avg": 41.035000000000004, "avgLastUpdate": "2018-05-08T16:11:36.864Z", "board_id": "4ac4847d-46d9-4c1c-bfe7-4eda8ce23100", "critLevel": 0, "location": "kitchen", "node_id": "b21a", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "sensortype": "humi", "threshold_max_acceptable": 50, "threshold_max_possible": 60, "threshold_min_acceptable": 30, "threshold_min_possible": 20 },
        { "_id": "5af1816364000b761607780d", "avg": 0, "avgLastUpdate": "2018-05-08T10:52:18.953Z", "board_id": "6e37cd31-b672-471b-a129-c484be8cf6b3", "critLevel": 0, "location": "bedroom", "node_id": "2dc6", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "sensortype": "temp", "threshold_max_acceptable": 25, "threshold_max_possible": 50, "threshold_min_acceptable": 10, "threshold_min_possible": -20 },
        { "_id": "5af1816364000b761607780e", "avg": 0, "avgLastUpdate": "2018-05-08T10:52:18.955Z", "board_id": "6e37cd31-b672-471b-a129-c484be8cf6b3", "critLevel": 0, "location": "bedroom", "node_id": "2dc6", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "sensortype": "humi", "threshold_max_acceptable": 50, "threshold_max_possible": 60, "threshold_min_acceptable": 30, "threshold_min_possible": 20 },
        { "_id": "5af1816364000b761607780f", "avg": 22.048000000000005, "avgLastUpdate": "2018-05-08T16:11:40.718Z", "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "critLevel": 0, "location": "bedroom", "node_id": "2f26", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "sensortype": "temp", "threshold_max_acceptable": 25, "threshold_max_possible": 50, "threshold_min_acceptable": 10, "threshold_min_possible": -20 },
        { "_id": "5af1816364000b7616077810", "avg": 22.03, "avgLastUpdate": "2018-05-08T15:42:55.876Z", "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "critLevel": 0, "location": "kitchen", "node_id": "60c8", "sensor_id": "a149d781-5a4f-4d92-be6e-c713422748cd", "sensortype": "temp", "threshold_max_acceptable": 25, "threshold_max_possible": 50, "threshold_min_acceptable": 10, "threshold_min_possible": -20 },
        { "_id": "5af1816364000b7616077811", "avg": 61.08, "avgLastUpdate": "2018-05-08T15:42:55.867Z", "board_id": "fc7f8ed2-f73e-4ff3-827c-f8cea42aa962", "critLevel": 2, "location": "kitchen", "node_id": "60c8", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "sensortype": "humi", "threshold_max_acceptable": 50, "threshold_max_possible": 60, "threshold_min_acceptable": 30, "threshold_min_possible": 20 },
        { "_id": "5af1816364000b7616077812", "avg": 38.053000000000004, "avgLastUpdate": "2018-05-08T16:11:40.711Z", "board_id": "942a41ac-2708-4933-9424-c848c6f0c868", "critLevel": 0, "location": "bedroom", "node_id": "2f26", "sensor_id": "aeed1a8e-6154-476d-be8f-8cfd346ce317", "sensortype": "humi", "threshold_max_acceptable": 50, "threshold_max_possible": 60, "threshold_min_acceptable": 30, "threshold_min_possible": 20 }
      ]);
    });
  }
}
