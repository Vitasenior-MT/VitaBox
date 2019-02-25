'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IpTablemodelSchema = new Schema({
  node_id: { type: String, required: true },
  node_ip: { type: String, required: true },
}, { versionKey: false });

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
  this.iptabledb.find({}, (err, result) => {
    callback(result);
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

IpTable.prototype.getData = function (node_id, callback) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaa ', node_id);
  this.iptabledb.find({ node_id: node_id }, (err, result) => {
    console.log('--------------------- AAAAAAAAAAAA ', result);
    console.log('--------------------- AAAAAAAAAAAA ', result.length);
    if (err) {
      return console.log("Error", err);
    }
    callback(result);
  });

  /*var query = [{
    $match: { node_id: node_id }
  },
  {
    $project: {
      _id: 0,
      node_id: 1,
      node_ip: 1
    }
  }];
  this.iptabledb.aggregate(query, (err, result) => {
    console.log('--------------------- AAAAAAAAAAAA ', result);
    console.log('--------------------- AAAAAAAAAAAA ', result.length);
    if (err) {
      console.log("Error", err);
      callback(false);
    }
    if (result.length > 0) {
      callback(result);
    } else {
      callback(false);
    }
  });*/
};

module.exports = IpTable;
