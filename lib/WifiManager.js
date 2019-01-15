'use strict'

var piWifi = require('./pi-wifi.js'),
    log = require('./logger'),
    errorLog = log.errorlog,
    successlog = log.successlog,
    exec = require('child_process').exec;

const commands = {
    ping: 'ping -c :NUMBER :SITE'
};

var WifiManager = function () {
}

WifiManager.prototype.ping = function (callback) {
    var self = this;
    console.log(self.replaceInCommand(commands.ping, { number: 3, site: 'www.google.com' }));

    let restartCec = exec(self.replaceInCommand(commands.ping, { number: 3, site: 'www.google.com' }));
    restartCec.stdout.on('data', (data) => {
        var lines = data.split(',');
        var recieved = '';
        var loss = '';
        if (lines.length > 2) {
            for (var i = 0; i < lines.length; i++) {
                var info = data.split(' ');
                if (info.length === 3) {
                    if (info[2] === 'loss') {
                        recieved = info[0];
                    }
                } else if (info.length === 2) {
                    if (info[1] === 'received') {
                        loss = info[0];
                    }
                }
            }
        }
        console.log('****************: ', loss, recieved);
    });
}

/**
 * @method replaceInCommand
 * @description Used to replace preset variables strings (e.g.: This is a :VAR text)
 * @param {string} text Text containg the variables to be replaced
 * @param {Object} toReplace Json object that contains the string to find (key) and the replace string (value)
 * @return Returns the text after replacing the variables
 */
WifiManager.prototype.replaceInCommand = function (text, toReplace) {
    for (var placeHolder in toReplace) {
        text = text.replace(new RegExp(':' + placeHolder.toUpperCase(), 'g'), toReplace[placeHolder]);
    }
    return text;
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
    piWifi.interfaceUp('wlan0', function (err) {
        if (err) {
            return errorLog.error(`WIFi: Scan: Error -> ${err.message}`);
        }
        successlog.info(`WIFI: Interface raised succesfully!`);
        callback();
    });
}

WifiManager.prototype.ReconnectInterface = function (callback) {
    var self = this;
    piWifi.interfaceDown('wlan0', function (err) {
        if (err) {
            return errorLog.error(`WIFi: Scan: Error -> ${err.message}`);
        }
        successlog.info(`WIFI: ReconnectInterface: Interface down succesfully!`);
        self.rfkillUnlock(() => {
            callback();
        });
    });
}

WifiManager.prototype.rfkillUnlock = function (callback) {
    var self = this;
    piWifi.rfkillUnlock(function (err) {
        if (err) {
            return errorLog.error(`WIFi: Unlock: Error -> ${err.message}`);
        }
        successlog.info(`WIFI: Unlock: unlocked succesfully!`);
        self.interfaceUp(() => {
            callback();
        });
    });
}

WifiManager.prototype.status = function (type, callback) {
    var self = this;
    piWifi.status('wlan0', function (err, status) {
        if (err) {
            return errorLog.error(`WIFi: Status: Error -> ${err.message}`);
        }
        successlog.info(`WIFI: Status: ${status.wpa_state}`);
        if (type === "check") {
            self.ReconnectInterface(() => {
                successlog.info(`WIFI: Status2: ${status.wpa_state}`);
            });
        } else {
            if (status.wpa_state !== "COMPLETED") {
                self.ReconnectInterface(() => {
                    callback()
                });
            }
        }

    });
}

WifiManager.prototype.connect = function (ssid, password, callback) {
    successlog.info(`WIFI: Connect: Trying with ssid: ${ssid} pass: ${password}`);
    piWifi.connect(ssid, password, function (err, data) {
        if (err) {
            errorLog.error(`WIFi: Connect: Error -> ${err.message}`);
            callback();
        } else {
            successlog.info(`WIFI: Connect: Successful connection!`);
        }
    });
}

module.exports = WifiManager;