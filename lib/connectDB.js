require('colors');
var mongoose = require('mongoose');

module.exports.connectDB = function(connStr) {
    // connect to mongo db
    mongoose.Promise = global.Promise;
    mongoose.connect(connStr, { useMongoClient: true }).then(() => {
        console.log("Successfully connected to MongoDB".italic.magenta);
      }).catch((err) => {
        console.log(err);
      }
    );
    mongoose.connection.on('error', console.error.bind(console, 'Connection Error : '.bold.red));
    mongoose.connection.once('open', () => {
      console.log("Connection OK!".italic.blue);
    });
};
