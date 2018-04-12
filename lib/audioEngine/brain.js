'use strict'
var opts = {},
    excecao = '\\é\\í\\ç\\ã\\á\\õ\\ó';

var Player = function () {
    this.player = require('play-sound')(opts);
    this.audioconcat = require('audioconcat');
};

Player.prototype.processText = function (text, callback) {
    var self = this;
    var arr = text.split(' ');
    process(arr, this.player, this.audioconcat, callback);
}

module.exports = Player;

var process = function (arr, player, audioconcat, callback) {
    var array = [];
    let result = 0;
    let number = 0;
    for (var index = 0; index <= arr.length - 1; index++) {
        if (parseInt(arr[index])) {
            processNumber(array, result, arr[index]);
        } else {
            processWord(array, arr[index]);
        }
        index === arr.length - 1 ? concatAll(player, audioconcat, array, callback) : null;
    }
}

var filePathName = function (type, name) {
    return './sounds/' + type + '/' + name + '.mp3';
}

var processNumber = function (array, result, number) {
    let frac01 = number.split(',');
    let frac02 = number.split('.');
    if (frac01.length === 2) {
        processNumbers(array, result, parseInt(frac01[0]));
        array.push(filePathName('numbers', 'virgula'));
        processNumbers(array, result, parseInt(frac01[1]));
    } else if (frac02.length === 2) {
        processNumbers(array, result, parseInt(frac02[0]));
        array.push(filePathName('numbers', 'ponto'));
        processNumbers(array, result, parseInt(frac02[1]));
    } else {
        processNumbers(array, result, parseInt(number));
    }
}

var processNumbers = function (array, result, number) {
    if (number > 100) {
        let divisor = 1;
        let calc = number;
        do {
            calc = calc / 10;
            divisor *= 10;
        } while (calc > 10);
        if (number > 100 && number < 200) {
            number = (number - 100);
            array.push(filePathName('numbers', 'cento'));
            array.push(filePathName('numbers', 'e'));
            processNumbers(array, result, number);
        } else {
            result = (number / divisor);
            result = parseInt(result) * divisor;
            if ((number - result) === 0) {
                array.push(filePathName('numbers', number));
            } else {
                array.push(filePathName('numbers', result));
                array.push(filePathName('numbers', 'e'));
                number = number - result;
                processNumbers(array, result, number);
            }
        }
    } else {
        if (number > 20 && number < 100) {
            result = (number / 10);
            result = parseInt(result) * 10;
            if ((number - result) === 0) {
                array.push(filePathName('numbers', number));
            } else {
                array.push(filePathName('numbers', result));
                array.push(filePathName('numbers', 'e'));
                array.push(filePathName('numbers', number - result));
            }
        }
        else {
            array.push(filePathName('numbers', number));
        }
    }
}

var processWord = function (array, word) {
    let regex = new RegExp('[^A-Za-z0-9' + excecao + ']');
    let lastChar = regex.test(word);
    console.log(lastChar);
    if (lastChar) {
        processWords(array, word.slice(0, -1));
        switch (word.slice(word.length - 1)) {
            case ',':
                processWords(array, 'virgula');
                break;
            case '.':
                processWords(array, 'ponto');
                break;
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