'use strict'
var Remote = require('./models/remotes.js'),
  Setting = require('./models/settings.js');

Remote = new Remote();
Setting = new Setting();

module.exports = {
  poulareDB: function () {
    module.exports.addRemoteCommands();
    // module.exports.addSettings();
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

  addSettings: function () {
    Setting.insertSetting(2);
  }
}
