

module.exports = {
    connectDirect: function (address, addessType, conIntervalMin, conIntervalMax, timeOut, latency) {
        var comCon = [];
        comCon = address.toLowerCase().split(":").reverse();
        comCon.push((addessType).toString(16));
        comCon.push(((conIntervalMin & parseInt("00FF", 16))).toString(16));
        comCon.push(((conIntervalMin & parseInt("FF00", 16)) >> 8).toString(16));
        comCon.push(((conIntervalMax & parseInt("00FF", 16))).toString(16));
        comCon.push(((conIntervalMax & parseInt("FF00", 16)) >> 8).toString(16));
        comCon.push(((timeOut & parseInt("00FF", 16))).toString(16));
        comCon.push(((timeOut & parseInt("FF00", 16)) >> 8).toString(16));
        comCon.push(((latency & parseInt("00FF", 16))).toString(16));
        comCon.push(((latency & parseInt("FF00", 16)) >> 8).toString(16));
        return comCon;
    },
    createCommand: function (atthandle, attr) {
        var command = [];
        command.push(0x00);
        command.push(Number((atthandle & parseInt("00FF", 16))).toString(16));
        command.push(Number((atthandle & parseInt("FF00", 16)) >> 8).toString(16));
        command.push(Number(attr.length).toString(16));
        for (let index = 0; index < attr.length; index++) {
            command.push(attr[index]);
        }
        return command;
    },
    dataCommand: function (attr) {
        var command = [];
        for (let index = 0; index < attr.length; index++) {
            command.push(attr[index]);
        }
        return command;
    },
    dataCommand2: function (attr) {
        var command = [];
        for (let index = 0; index < attr.length; index++) {
            command.push(Number(attr[index]).toString(16));
        }
        return command;
    },
    dataCommandSend: function (LL, CID, CMD, PL) {
        var payload = [];
        payload.push(LL + 4);
        payload.push(0x00);
        payload.push(LL);
        payload.push(CID);
        payload.push(CMD);
        if (LL > 0) {
            for (var i = 0; i < LL; i++) {
                payload.push(PL[i]);
            }
        }
        return payload;
    },
    printDataValues: function (data) {
        var t = ""
        if (data) {
            for (let index = 0; index < data.length; index++) {
                t += data[index] + "-";
            }
        }
        return t;
    }
}