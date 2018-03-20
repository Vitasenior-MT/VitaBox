'use strict'
var Remote = require('./models/remotes.js'),
  LocationPlace = require('./models/locationplaces.js'),
  Threshold = require('./models/thresholds.js'),
  NodeId = require('./models/nodeids.js'),
  Setting = require('./models/settings.js');

Remote = new Remote();
LocationPlace = new LocationPlace();
Threshold = new Threshold();
Setting = new Setting();
NodeId = new NodeId();

module.exports = {
  poulareDB: function () {
    module.exports.addRemoteCommands();
    module.exports.addLocationPlaces();
    module.exports.addThreshold();
    // module.exports.addSettings();
    module.exports.addNodeIds();
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
        { name: 'key_up', code: '1', task: 'up', timed_flg: true },
        { name: 'key_down', code: '2', task: 'down', timed_flg: true },
        { name: 'key_left', code: '3', task: 'left', timed_flg: true },
        { name: 'key_right', code: '4', task: 'right', timed_flg: true },
        { name: 'key_play', code: '44', task: 'none', timed_flg: false },
        { name: 'key_stop', code: '45', task: 'none', timed_flg: false },
        { name: 'key_pause', code: '46', task: 'none', timed_flg: false },
        { name: 'key_rewind', code: '48', task: 'none', timed_flg: false },
        { name: 'key_fastforward', code: '49', task: 'none', timed_flg: false },
        { name: 'key_exit', code: 'd', task: 'ok_btn', timed_flg: true },
        { name: 'key_select', code: '0', task: 'none', timed_flg: false },
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

  addLocationPlaces: function () {
    LocationPlace.countLocationsPlaces(function () {
      LocationPlace.inserAlltLocationPlace([
        { _id: 1, name: 'Quarto01' },
        { _id: 2, name: 'Quarto02' },
        { _id: 3, name: 'Cozinha' },
        { _id: 4, name: 'Casa De Banho01' },
        { _id: 5, name: 'Casa De Banho02' },
        { _id: 6, name: 'Sala' },
        { _id: 7, name: 'WC' }
      ]);
    });
  },

  addThreshold: function () {
    Threshold.countThreshold(function () {
      Threshold.insertAllThreshold([
        { threshold: 31, sensortype: 'temp', location_id: 1 },
        { threshold: 32, sensortype: 'temp', location_id: 2 },
        { threshold: 35, sensortype: 'temp', location_id: 3 },
        { threshold: 30, sensortype: 'temp', location_id: 4 },
        { threshold: 30, sensortype: 'temp', location_id: 5 },
        { threshold: 35, sensortype: 'temp', location_id: 6 },
        { threshold: 35, sensortype: 'temp', location_id: 7 },
        { threshold: 29, sensortype: 'co2', location_id: 1 },
        { threshold: 29, sensortype: 'co2', location_id: 2 },
        { threshold: 35, sensortype: 'co2', location_id: 3 },
        { threshold: 31, sensortype: 'co2', location_id: 4 },
        { threshold: 31, sensortype: 'co2', location_id: 5 },
        { threshold: 30, sensortype: 'co2', location_id: 6 },
        { threshold: 30, sensortype: 'co2', location_id: 7 },
        { threshold: 25, sensortype: 'monoxido', location_id: 1 },
        { threshold: 25, sensortype: 'monoxido', location_id: 2 },
        { threshold: 35, sensortype: 'monoxido', location_id: 3 },
        { threshold: 26, sensortype: 'monoxido', location_id: 4 },
        { threshold: 27, sensortype: 'monoxido', location_id: 5 },
        { threshold: 28, sensortype: 'monoxido', location_id: 6 },
        { threshold: 28, sensortype: 'monoxido', location_id: 7 },
        { threshold: 67, sensortype: 'humi', location_id: 1 },
        { threshold: 78, sensortype: 'humi', location_id: 2 },
        { threshold: 56, sensortype: 'humi', location_id: 3 },
        { threshold: 67, sensortype: 'humi', location_id: 4 },
        { threshold: 69, sensortype: 'humi', location_id: 5 },
        { threshold: 75, sensortype: 'humi', location_id: 6 },
        { threshold: 88, sensortype: 'humi', location_id: 7 }
      ]);
    });
  },

  addSettings: function () {
    Setting.insertSetting(2);
  },

  addNodeIds: function () {
    NodeId.countRemoteCmd(function () {
      NodeId.insert([
        { nodeid: '60c8' }
      ]);
    });
  }
}
