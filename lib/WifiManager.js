'use strict'

var piWifi = require('./pi-wifi.js'),
    log = require('./logger'),
    errorLog = log.errorlog,
    successlog = log.successlog;

var WifiManager = function () {
}

WifiManager.prototype.startScan = function (callback) {
    piWifi.scan(function (err, networks) {
        if (err) {
            return errorLog.error(`WIFi: Scan: Error -> ${err.message}`);
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
        successlog.info(`WIFI: Interface raised succesfully!`);
    });
}

WifiManager.prototype.rfkillUnlock = function (callback) {
    piWifi.rfkillUnlock(function (err) {
        if (err) {
            return errorLog.error(`WIFi: Unlock: Error -> ${err.message}`);
        }
        callback();
        successlog.info(`WIFI: Unlock: unlocked succesfully!`);
    });
}

WifiManager.prototype.status = function (callback) {
    var self = this;
    piWifi.status('wlan0', function (err, status) {
        if (err) {
            return errorLog.error(`WIFi: Status: Error -> ${err.message}`);
        }
        successlog.info(`WIFI: Status: ${status.wpa_state}`);
        if (status.wpa_state !== "COMPLETED") {
            self.interfaceUp(() => {
                callback()
            });
        }
    });
}

WifiManager.prototype.connect = function (ssid, password, callback) {
    var self = this;
    piWifi.connect(ssid, password, function (err) {
        if (err) {
            errorLog.error(`WIFi: Connect: Error -> ${err.message}`);
            callback();
        }
        successlog.info(`WIFI: Connect: Successful connection!`);
    });
}

module.exports = WifiManager;