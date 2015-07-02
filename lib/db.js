module.exports = DB;

/************
 * Requires *
 ************/
var mongoose = require("mongoose");
require("mongo-relation");

/****************
 * DB Class *
 ****************/
function DB(core) {
  var self = this;
  self.core = core;

  mongoose.connect("mongodb://localhost/dashboard_db");

  mongoose.connection.on('error', function(err) {
    self.log('Connection error:' + err);
  });
  mongoose.connection.once('open', function() {
    self.log('Connection successful.');

    var User = require("./models/user");
    var Board = require("./models/board");
    var Widget = require("./models/widget");

    var user = new User({
      "username": "John",
      "password": "123",
      "email": "a@b.com"
    });

    user.boards.create({
      name: "Test board"
    }, function(err, user, board) {
      self.log(user);
      self.log(board);
    });
  });
}

DB.prototype = {
  core: null,

  log: function(message) {
    this.core.log("(DB) " + message);
  }
};