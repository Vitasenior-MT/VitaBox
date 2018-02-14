'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var LocationPlaceSchema = new Schema({
  _id: { type: Number, required: true},
  name: { type: String, required: true }
}, { _id: false });

var LocationPlace = function(){
  this.locationplacedb = mongoose.model('LocationPlace', LocationPlaceSchema);
};

LocationPlace.prototype.insertLocationPlace = function (name, id) {
    this.locationplacedb.create({
        _id: id,
        name: name
    }, (err, location) => {
      if (err){
        return console.log(err);
      }
      console.log(location);
    });
}

LocationPlace.prototype.countLocationsPlaces = function(callback){
  this.locationplacedb.count(function(err, places) {
    if (err) {
        return console.log("Error", err);
    }
    if (places <= 0) {
        callback();
    }
  });
};

LocationPlace.prototype.inserAlltLocationPlace = function(params){
  this.locationplacedb.insertMany(params, function(err, result) {
        if (err) {
            return console.log(err);
        }
        console.log('inserAlltLocationPlace inserted!' /*, result*/ );
    });
};

LocationPlace.prototype.findOneLocationPlace = function(location, callback){
  this.locationplacedb.findOne({ name: location }, function(err, loc) {
    if (err) {
      return console.log(err);
    }
    if (loc) {
      callback(loc);
    }
  });
};

LocationPlace.prototype.getAllLocations = function(res) {
  this.locationplacedb.find({}, function(err, locs) {
    if (err) {
      return res.json({
        status: false,
        data: err.toString()
      });
    }
    return res.json({
      status: true,
      data: locs
    });
  })
};

LocationPlace.prototype.getPlaceNameById = function(id, res, callback) {
  this.locationplacedb.find({_id: id}, function(err, placename){
    if (err) {
      return res.json({
        status: false,
        data: err.toString()
      });
    }
    callback(placename[0].name);
  });
};

module.exports = LocationPlace;
