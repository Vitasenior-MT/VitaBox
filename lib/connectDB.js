require("colors");
var mongoose = require("mongoose");

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
      mongoose.connect(connStr, {
        server: {
          auto_reconnect: true,
          socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }
        },
        replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
      });
    });

    mongoose.connect(connStr, {
      server: { auto_reconnect: true }
    }).then(() => {
      console.log("Successfully connected to MongoDB".italic.magenta);
    }).catch(err => {
      console.log(err);
    });
    mongoose.connection.on(
      "error",
      console.error.bind(console, "Connection Error : ".bold.red)
    );
    mongoose.connection.once("open", () => {
      console.log("Connection OK!".italic.blue);
      callback();
    });
  }
};
