'use strict'
var LocationPlace = require('./models/locationplaces.js');

LocationPlace = new LocationPlace();

module.exports = {
  getAllLocations : function(req, res) {
    LocationPlace.getAllLocations(res);
  },
  getLocationName : function(placeId, res, callback){
    LocationPlace.getPlaceNameById(placeId, res, callback);
  }
}
