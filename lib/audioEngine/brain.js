'use strict'

var log = require('./../logger'),
    errorLog = log.errorlog,
    successlog = log.successlog,
    audioconcat = require('audioconcat'),
    fs = require('fs');

function Player() {
};

Player.prototype.processText = function (text, callback) {
    successlog.info(`Original Text: ${text}`);
    process(text.toLowerCase().split(' '), callback);
}

module.exports = Player;

function process(arr, callback) {
    var array = [];
    for (var index = 0; index <= arr.length - 1; index++) {
        if (parseInt(arr[index]) || arr[index] === '0') {
            processNumbers(array, arr[index]);
        } else {
            processWord(array, arr[index]);
        }
        index === arr.length - 1 ? concatAll(array, callback) : null;
    }
}

function filePathName(type, name) {
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

function processWord(array, word) {
    let regex = new RegExp('[^A-Za-z0-9]');
    let lastChar = regex.test(word);
    if (word.length > 1 && lastChar) {
        word = word.replace('ç', 'c').replace('ã', 'a').replace('í', 'i').replace('ó', 'o').replace('á', 'a').replace('õ', 'o').replace('é', 'e').replace('-', '').replace(' ', '');
        lastChar = regex.test(word);
    }
    if (word.length === 1 && lastChar) {
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
                case ',':
                    processWords(array, 'virgula');
                    break;
                case '.':
                    processWords(array, 'ponto');
                    break;
                case '%':
                    processWords(array, 'porcento');
                    break;
            }
        } else {
            if (word.slice(word.length - 1) === 'c') {
                processWords(array, 'graus');
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

        }
    } else {
        processWords(array, word);
    }
}

function processWords(array, word) {
    array.push(filePathName('words', word));
}

/**
 * TODO: Concatenação dos ficheiros de áudio
 * @param { Array } arr lista de caminhos para os ficheiros de áudio
 * @param { Function } callback
 */
function concatAll(arr, callback) {
    let fileName = new Date().getTime() + '.mp3'; // nome unico do ficheiro
    let dir = 'public/dist/static/.temp/'; // caminho do ficheiro a ser criado
    if (arr[arr.length - 1] === './sounds/words/.mp3') { // verifica se a última posição é vazia
        arr = arr.slice(0, -1); // elimina posição vazia
    }
    cleanNoFiles(arr, (arrRevised) => {
        if (!fs.existsSync(dir)) { // verifica se existe o directório
            fs.mkdirSync(dir); // cria o directório
        }
        audioconcat(arrRevised) // junta todos os ficheiros num único ficheiro
            .concat(dir + fileName)
            .on('start', function (command) {
                successlog.info(`ffmpeg process started: ${command}`);
            })
            .on('error', function (err, stdout, stderr) {
                errorLog.info(`Error: ${err}`);
                errorLog.info(`ffmpeg stderr: ${stderr}`);
            })
            .on('end', function (output) {
                callback(fileName);
            })
    });
}

function cleanNoFiles(arr, callback) {
    for (let index = arr.length - 1; index >= 0; index--) {
        if (!fs.existsSync(arr[index])) {
            arr.slice(index);
            errorLog.info(`Error Missing Sound Files: ${arr[index]} file does not exists`);
            if (index === 0) {
                callback(arr);
            }
        }
    }
}