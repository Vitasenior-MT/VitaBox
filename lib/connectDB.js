require("colors");
var mongoose = require("mongoose"),
  options = {
    useMongoClient: true,
    autoIndex: false,                 // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500,           // Reconnect every 500ms
    poolSize: 10,                     // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  },
  optionsReconnect = {
    server: {
      socketOptions: {
        socketTimeoutMS: 30000,
        keepAlive: true
      },
      reconnectTries: 30
    },
    replset: {
      socketOptions: {
        socketTimeoutMS: 30000,
        keepAlive: true
      },
      reconnectTries: 30
    } /* ,
    mongos: {
      socketOptions: {
        socketTimeoutMS: 0,
        keepAlive: true
      },
      reconnectTries: 30
    }*/
  };

module.exports = {
  connectDB: function (connStr, callback) {
    // connect to mongo db
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on("connecting", function () {
      console.log("connecting");
    });

    db.on("error", function (error) {
      console.error("Error in MongoDb connection: " + error);
      mongoose.disconnect();
    });
    db.on("connected", function () {
      console.log("connected!");
    });
    db.once("open", function () {
      console.log("connection open");
    });
    db.on("reconnected", function () {
      console.log("reconnected");
    });
    db.on("disconnected", function () {
      console.log("disconnected");
      console.log("dbURI is: " + connStr);
      mongoose.connect(connStr, optionsReconnect);
    });

    mongoose.connect(connStr, options, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("Successfully connected to MongoDB".italic.magenta);
    });
    mongoose.connection.on("error", console.error.bind(console, "Connection Error : ".bold.red)
    );
    mongoose.connection.once("open", () => {
      console.log("Connection OK!".italic.blue);
      callback();
    });
  }
};
