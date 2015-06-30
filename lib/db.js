module.exports = DB;

/************
 * Requires *
 ************/
var Sequelize = require("sequelize");

/****************
 * Server Class *
 ****************/
function DB(core, port) {
  var self = this;
  self.core = core;

  var sequelize = new Sequelize('dashboard', 'dashboard', '123', {
    dialect: 'postgres',
    port: port
  });

  sequelize.authenticate()
    .then(function(err) {
      self.log('Connection has been established successfully.');
    }, function(err) {
      self.log('Unable to connect to the database: ' + err);
    });
}

DB.prototype = {
  core: null,

  log: function(message) {
    this.core.log("(DB) " + message);
  }
};