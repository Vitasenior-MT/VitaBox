'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IpTablemodelSchema = new Schema({
  node_id: { type: String, required: true },
  node_ip: { type: String, required: true },
}, { _id: false, versionKey: false });

var IpTable = function () {
  this.iptabledb = mongoose.model('IpTable', IpTablemodelSchema);
};

IpTable.prototype.insert = function (data, callback) {
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  this.iptabledb.findOneAndUpdate({ node_id: data.node_id }, { node_id: data.node_id, node_ip: data.ip }, options, (err, result) => {
    callback();
  });
};

IpTable.prototype.get = function (callback) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaa ');
  this.iptabledb.find({}, (err, result) => {
    console.log('--------------------- AAAAAAAAAAAA ', result);
    if (err) {
      return console.log("Error", err);
    }
    if (result.length > 0) {
      callback(result);
    } else {
      callback(false);
    }
  });
};

IpTable.prototype.get2 = function (node_id, callback) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaa ', node_id);
  this.iptabledb.findOne({ node_id: node_id }, (err, result) => {
    console.log('--------------------- AAAAAAAAAAAA ', result);
    if (err) {
      return console.log("Error", err);
    }
    if (result.length > 0) {
      callback(result);
    } else {
      callback(false);
    }
  });
};

module.exports = IpTable;
