'use strict'

var piWifi = require('./pi-wifi.js');

var WifiManager = function () {
}

WifiManager.prototype.startScan = function (callback) {
    var self = this;
    piWifi.scan(function (err, networks) {
        if (err) {
            return console.error(err.message);
        }
        callback(networks);
    });
}

WifiManager.prototype.interfaceUp = function (callback) {
    var self = this;
    piWifi.interfaceUp('wlan0', function (err) {
        if (err) {
            self.rfkillUnlock(() => {
                self.interfaceUp();
                callback();
            });
        }
        if (callback) callback();
        console.log('Interface raised succesfully!');
    });
}

WifiManager.prototype.rfkillUnlock = function (callback) {
    piWifi.rfkillUnlock(function (err) {
        if (err) {
            return console.error(err.message);
        }
        callback();
        console.log('unlocked succesfully!');
    });
}

WifiManager.prototype.status = function (callback) {
    var self = this;
    piWifi.status('wlan0', function (err, status) {
        if (err) {
            return console.error(err.message);
        }
        console.log('status: ', status);
        if (status.wpa_state !== "COMPLETED") {
            self.interfaceUp(() => {
                callback()
            });
        }
    });
}

WifiManager.prototype.connect = function (ssid, password, callback) {
    piWifi.connect(ssid, password, function (err) {
        if (err) {
            console.error(err.message);
            callback();
        }
        console.log('Successful connection!');
    });
}

module.exports = WifiManager;