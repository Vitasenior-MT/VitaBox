import { WSAEAFNOSUPPORT } from 'constants';

'use strict'
var Remote = require('./models/remotes.js'),
  Board = require('./models/boards.js'),
  Patient = require('./models/patients.js'),
  Setting = require('./models/settings.js');

Remote = new Remote();
Setting = new Setting();

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

  addSettings: function () {
    Setting.insertSetting(2);
  },

  addBio: function () {
    Board.insert([
      {
        id: 'da99ebb6-7d4f-43da-ac02-52076ed4db70', location: null, node_id: '60c8', since: '2018-04-23', mac_addr: '00:12:4b:00:06:0d:60:c8', Boardmodel: [
          {
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006cb',
            type: 'bio',
            name: 'Balança',
            Sensors: [
              {
                id: '294a400c-e1e9-436e-b3e5-764f568cde48',
                transducer: 'dht22',
                measure: 'peso'
              }
            ]
          }
        ]
      },
      {
        id: 'da99ebb6-7d4f-43da-ac02-52076ed4db71', location: null, node_id: '60c8', since: '2018-04-23', mac_addr: '00:12:4b:00:06:0d:60:c1', Boardmodel: [
          {
            id: 'd6a24ae1-663c-4095-b3ee-08b7cf9006c1',
            type: 'bio',
            name: 'Balança',
            Sensors: [
              {
                id: '294a400c-e1e9-436e-b3e5-764f568cde41',
                transducer: 'dht22',
                measure: 'peso'
              }
            ]
          }
        ]
      }
    ]);
  },

  addPatients: function () {
    Patient.count(function () {
      Patient.insert({
        patients: [
          { name: 'José António', gender: 'male', birthdate: '1987-02-28', since: '2018-03-19', id: '02d3468c-d8b7-4895-a678-71f2efa715d1' },
          { name: 'Manuela Antonieta', gender: 'female', birthdate: '1972-02-28', since: '2018-03-19', id: '02d3468c-d8b7-4895-a678-71f2efa715dd' },
        ]
      });
    });
  }
}
