'use strict'
// Info: http://mongoosejs.com/docs/connections.html#use-mong
var Remote = require('./models/remotes.js'),
  Board = require('./models/boards.js'),
  Patient = require('./models/patients.js'),
  Setting = require('./models/settings.js');

Remote = new Remote();
Setting = new Setting();
Board = new Board();
Patient = new Patient();

module.exports = {
  poulareDB: function () {
    module.exports.addRemoteCommands();
    // module.exports.addSettings();
    module.exports.addBio();
    module.exports.addPatients();
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
        { name: 'key_9', code: '29', task: 'none', timed_flg: false },
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
      since: '2018-04-23',
      mac_addr: '50:8c:b1:6b:17:4f',
      Boardmodel: [{
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
        type: 'bio',
        name: 'bloodpressure',
        Sensors: [{
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'systolic',
          measure: 'maxima'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'diastolic',
          measure: 'minima'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde48',
          transducer: 'pulse',
          measure: 'pulso'
        }]
      }]
    }, {
      id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
      location: null,
      node_id: '60c1',
      since: '2018-04-23',
      mac_addr: 'a8:1b:6a:a9:07:b9',
      Boardmodel: [{
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
        type: 'bio',
        name: 'bodytemperature',
        Sensors: [{
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'battery',
          measure: 'bateria'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'temp',
          measure: 'temperatura'
        }]
      }]
    }, {
      id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71',
      location: null,
      node_id: '60c2',
      since: '2018-04-23',
      mac_addr: '00:a0:50:04:26:2e',
      Boardmodel: [{
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
        type: 'bio',
        name: 'bodypulse',
        Sensors: [{
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'spo2',
          measure: 'oxigenio'
        }, {
          id: '294a400c-e1e9-436e-b3e5-764f568cde41',
          transducer: 'pulse',
          measure: 'pulso'
        }]
      }]
    }, {
      id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70',
      location: null,
      node_id: '60c3',
      since: '2018-04-23',
      mac_addr: '8c:de:52:97:c0:34',
      Boardmodel: [{
        id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
        type: 'bio',
        name: 'bodyscale',
        Sensors: [{
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
        }]
      }]
    }]);
  },

  addPatients: function () {
    Patient.count(function () {
      Patient.insert({
        patients: [{
          name: 'José António',
          gender: 'male',
          birthdate: '1987-02-28',
          since: '2018-03-19',
          height: 1.75,
          Weight: 75,
          id: '02d3468c-d8b7-4895-a678-71f2efa715d1',
          device_list: [{
            device_type: "bloodpressure"
          }, {
            device_type: "bodypulse"
          }, {
            device_type: "bodyscale"
          }]
          /*device_list: {
              bloodpressure: true,
              body_temperature: false,
              body_pulse: true,
              body_scale: false,
              blood_glucose: false
            }*/
        }, {
          name: 'Manuela Antonieta',
          gender: 'female',
          birthdate: '1972-02-28',
          since: '2018-03-19',
          height: 1.55,
          Weight: 65,
          id: '02d3468c-d8b7-4895-a678-71f2efa715dd',
          device_list: [{
            device_type: "bloodpressure"
          }, {
            device_type: "bodytemperature"
          }, {
            device_type: "bodypulse"
          }, {
            device_type: "bodyscale"
          }, {
            device_type: "bloodglucose"
          }]
          /*device_list: {
            bloodpressure: true,
            body_temperature: false,
            body_pulse: true,
            body_scale: false,
            blood_glucose: false
          }*/
        }]
      });
    });
  }
}
