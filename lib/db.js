module.exports = DB;

/************
 * Requires *
 ************/
var mongoose = require("mongoose");

/****************
 * DB Class *
 ****************/
function DB(core) {
  var self = this;
  self.core = core;

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

  self.log("Using database '" + self.database + "'");

  mongoose.connect("mongodb://localhost/" + self.dashboard);

  mongoose.connection.on('error', function(err) {
    self.log('Connection error:' + err);
    process.exit(1);
  });
  mongoose.connection.once('open', function() {
    self.log('Connected.');
  });
}

DB.prototype = {
  core: null,
  database: null,

  log: function(message) {
    this.core.log("(DB) " + message);
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