'use strict'
var Player = require('./brain.js');

Player = new Player();

module.exports = {
    getData: function(text, callback){
        Player.processText(text, callback);
    }
}
