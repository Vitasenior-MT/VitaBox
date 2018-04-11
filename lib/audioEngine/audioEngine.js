'use strict'
var Player = require('./brain.js'),
    sktcon = null;

Player = new Player();

module.exports = {
    addskt: function (skt) {
        sktcon = skt;
    },
    getData: function(text, callback){
        Player.processText(text, callback);
    }
}
