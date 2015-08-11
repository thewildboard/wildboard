module.exports = DB;

/************
 * Requires *
 ************/
var mongoose = require("mongoose");

var Log = require("./log");

/****************
 * DB Class *
 ****************/
function DB(core) {
  var self = this;

  switch (core.mode) {
    case "test":
      self.database = "dashboard_test";
      break;
    case "development":
      self.database = "dashboard_dev";
      break;
    case "production":
      self.database = "dashboard_prod";
      break;
    default:
    throw new UnrecognisedRunMode("Un recognised '" + core.mode + "'");
  }

  mongoose.connect("mongodb://localhost/" + self.database);

  mongoose.connection.on('error', function(err) {
    self.log('Connection error:' + err);
    process.exit(1);
  });
  mongoose.connection.once('open', function() {
    self.log("Connected to database '" + self.database + "'");
  });
}

DB.prototype = {
  database: null,

  log: function(message) {
    Log.log("(DB) " + message);
  }
};

/**********
 * Errors *
 *********/
function UnrecognisedRunMode(message) {
  this.name = "UnrecognisedRunMode";
  this.message = message || "";
}
UnrecognisedRunMode.prototype = Error.prototype;