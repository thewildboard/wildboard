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

  mongoose.connect("mongodb://localhost/dashboard_db");

  mongoose.connection.on('error', function (err) {
    self.log('Connection error:' + err);
  });
  mongoose.connection.once('open', function () {
    self.log('Connection successful.');
  });
}

DB.prototype = {
  core: null,

  log: function(message) {
    this.core.log("(DB) " + message);
  }
};