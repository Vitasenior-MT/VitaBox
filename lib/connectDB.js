require('colors');
var mongoose = require('mongoose');

module.exports.connectDB = function(connStr) {
    // connect to mongo db
    mongoose.Promise = global.Promise;
    mongoose.connect(connStr).then(
    	() => {
        console.log("Successfully connected to MongoDB".italic.magenta);
      },
    	(err) => { 
        console.log(err);
      }
    );
    mongoose.connection.on('error', console.error.bind(console, 'Connection Error : '.bold.red));
    mongoose.connection.once('open', () => {
      console.log("Connection OK!".italic.blue);
    });
};
