'use strict'
var opts = {};

var Player = function () {
    this.player = require('play-sound')(opts);
    this.audioconcat = require('audioconcat');
};

Player.prototype.processText = function (text, callback) {
    var self = this;
    var arr = text.toLowerCase().split(' ');
    process(arr, this.player, this.audioconcat, callback);
}

module.exports = Player;

var process = function (arr, player, audioconcat, callback) {
    var array = [];
    for (var index = 0; index <= arr.length - 1; index++) {
        if (parseInt(arr[index])) {
            processNumbers(array, arr[index]);
        } else {
            processWord(array, arr[index]);
        }
        index === arr.length - 1 ? concatAll(player, audioconcat, array, callback) : null;
    }
}

var filePathName = function (type, name) {
    return './sounds/' + type + '/' + name + '.mp3';
}

function processNumbers(array, val) {
    let valN01 = val.toString().split(',');
    let valN02 = val.toString().split('.');
    if (valN01.length === 2) {
        prossNum(array, valN01, 'virgula');
    } else if (valN02.length === 2) {
        prossNum(array, valN02, 'ponto');
    } else {
        prossNums(array, val);
    }
}

function prossNum(array, valN, type) {
    prossNums(array, valN[0]);
    array.push(filePathName('numbers', type));
    prossNums(array, valN[1]);
}

function prossNums(array, num) {
    var expNum = num ? num.length : null;
    if (num && expNum) {
        if (expNum === 1 || parseInt(num) < 20) {
            array.push(filePathName('numbers', num));
        } else {
            for (let i = 0; i < expNum; i++) {
                if ((((expNum - i) === 2 && expNum > 2) && parseInt(num[i]) !== 0) || (expNum - i) === 1 && parseInt(num[i]) !== 0) {
                    array.push(filePathName('numbers', 'e'));
                }
                if (parseInt(num[i]) !== 0) {
                    if (parseInt(num) === 100) {
                        array.push(filePathName('numbers', 'cem'));
                    } else {
                        array.push(filePathName('numbers', num[i] * Math.pow(10, (expNum - i - 1))));
                    }
                }
            }
        }
    }
}

var processWord = function (array, word) {
    let regex = new RegExp('[^A-Za-z0-9]');
    let lastChar = regex.test(word);
    if (word.length > 1 && lastChar) {
        word = word.replace('ç', 'c').replace('ã', 'a').replace('í', 'i').replace('ó', 'o').replace('á', 'a');
        lastChar = regex.test(word);
    }
    if (lastChar) {
        if (word.length === 1) {
            switch (word) {
                case 'é':
                    processWords(array, 'ee');
                    break;
                case 'è':
                    processWords(array, 'eee');
                    break;
                case 'á':
                    processWords(array, 'aa');
                    break;
                case 'à':
                    processWords(array, 'aaa');
                    break;
            }
        } else {
            processWords(array, word.slice(0, -1));
            switch (word.slice(word.length - 1)) {
                case ',':
                    processWords(array, 'virgula');
                    break;
                case '.':
                    processWords(array, 'ponto');
                    break;
            }
        }
    } else {
        processWords(array, word);
    }
}

var processWords = function (array, word) {
    array.push(filePathName('words', word));
}

var concatAll = function (player, audioconcat, arr, callback) {
    let fileName = new Date().getTime() + '.mp3';
    let fs = require('fs');
    let dir = 'public/dist/static/.temp/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    audioconcat(arr)
        .concat(dir + fileName)
        .on('start', function (command) {
            console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Audio created in:', output)
            callback(fileName);
        })
}