'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IpTablemodelSchema = new Schema({
  node_id: { type: String, required: true },
  node_ip: { type: String, required: true },
  error_count: { type: Number, default: 0 },
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

IpTable.prototype.set = function (node_id, node_ip, current_count, callback) {
  let count = current_count + 1;
  if (count === 10) {
    this.IpTable.remove({ "node_id": node_id, "node_ip": node_ip }, () => {
      callback();
    });
  }
  this.iptabledb.update(
    { "node_id": node_id, "node_ip": node_ip },
    { $set: { "error_count": count } },
    { upsert: true },
    function (err, result) {
      if (err) {
        return console.log("Error", err);
      }
    });
};

IpTable.prototype.getData = function (node_id_data, callback) {
  var query = [{
    $match: { node_id: node_id_data.node_id }
  },
  {
    $project: {
      _id: 0,
      node_id: 1,
      node_ip: 1
    }
  }];
  this.iptabledb.aggregate(query, (err, result) => {
    if (err) {
      console.log("Error", err);
      callback(false);
    }
    if (result.length > 0) {
      callback(result);
    } else {
      callback(false);
    }
  });
};

module.exports = IpTable;
