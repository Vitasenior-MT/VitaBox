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

/**
 * @method ping
 * @description Used to verify the connection
 * @param {string} site Text containg the website to ping
 * @param {number} number Number to the number of packages to send
 * @param {function} callback Funtion to return the data
 */
WifiManager.prototype.ping = function (callback, number, site) {
    var self = this;
    let restartCec = exec(self.replaceInCommand(commands.ping, { number: number, site: site }));
    restartCec.stdout.on('data', (data) => {
        successlog.info(`Ping ${data}`);
        let lines = data.split(','), wifiData;
        if (lines.length > 2) {
            for (var index in lines) {
                let loss = lines[index].split(' ');
                if (loss.length > 3) {
                    if (loss[3] === 'loss') {
                        wifiData = {
                            recieved: parseInt(lines[1].split(' ')[1]),
                            loss: loss[1]
                        }
                        callback(wifiData);
                    }
                }
            }
        }
    });
    restartCec.stderr.on('data', (data) => {
        errorLog.error(`Ping error ${data}`);
        callback(false);
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

WifiManager.prototype.status = function (callback) {
    var self = this;
    piWifi.status('wlan0', function (err, status) {
        if (err) {
            errorLog.error(`WIFi: Status: Error -> ${err.message}`);
            callback();
        }
        successlog.info(`WIFI: Status: ${status.wpa_state}`);
        self.ReconnectInterface(() => {
            callback();
        });
    });
}

WifiManager.prototype.connect = function (ssid, password, callback) {
    successlog.info(`WIFI: Connect: Trying with ssid: ${ssid} pass: ${password}`);
    piWifi.connect(ssid, password, function (err, data) {
        if (err) {
            errorLog.error(`WIFi: Connect: Error -> ${err.message}`);
            callback(false);
        } else {
            process.env.connection = true;
            successlog.info(`WIFI: Connect: Successful connection!`);
            callback(true);
        }
    });
}

module.exports = WifiManager;