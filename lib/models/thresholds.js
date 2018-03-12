'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var ThresholdSchema = new Schema({
  threshold: { type: Number, required: true },
  threshold_malfunctioning_min: { type: Number },
  threshold_near_min: { type: Number },
  threshold_min: { type: Number },
  threshold_near_max: { type: Number },
  threshold_max: { type: Number, required: true },
  threshold_malfunctioning_max: { type: Number, required: true },
  sensortype: { type: String, required: true },
  location_id: { type: Number, required: true }
});

var Threshold = function () {
  this.thresholddb = mongoose.model('Threshold', ThresholdSchema);
};

Threshold.prototype.insertThreshold = function (threshold, sensortype, location_id) {
  this.thresholddb.create({
    threshold: threshold,
    sensortype: sensortype,
    location_id: location_id
  }, (err, threshold) => {
    if (err) {
      return console.log(err);
    }
    console.log(threshold);
  });
};

Threshold.prototype.countThreshold = function (callback) {
  this.thresholddb.count(function (err, threshold) {
    if (err) {
      return console.log("Error", err);
    }
    if (threshold <= 0) {
      callback();
    }
  });
};

Threshold.prototype.insertAllThreshold = function (params) {
  this.thresholddb.insertMany(params, function (err, result) {
    if (err) {
      return console.log(err);
    }
    console.log('insertAllThreshold inserted!' /*, result*/);
  });
};

Threshold.prototype.findOneThreshold = function (sensortype, loc, callback) {
  this.thresholddb.findOne({ sensortype: sensortype, location_id: loc._id }, function (err, thres) {
    if (err) {
      return console.log(err);
    }
    if (thres) {
      callback(thres);
    }
  });
};

module.exports = Threshold;
