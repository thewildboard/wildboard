module.exports = Server;

/************
 * Requires *
 ************/
var express = require("express");

/****************
 * Server Class *
 ****************/
function Server(core, port) {
  var self = this;
  self.core = core;
  self.app = express();

  self.app.use(express.static(__dirname + '/public'));
  core.call("serverSetup", self.app);

  self.server = self.app.listen(port, function() {
    self.log('Listening at ' + port);
  });
}

Server.prototype = {
  core: null,

  app: null,
  server: null,

  close: function() {
    if (!this.server) {
      throw new ServerNotInitialized();
    }

    this.server.close();
    this.log("Closed.");
  },

  log: function(message) {
    this.core.log("(Server) " + message)
  }
};


/**********
 * Errors *
 *********/
function IncorrectArgumentType(message) {
  this.name = "IncorrectArgumentType";
  this.message = message || "";
}
IncorrectArgumentType.prototype = Error.prototype;


function ServerNotInitialized(message) {
  this.name = "ServerNotInitialized";
  this.message = message || "The http server is not initialized.";
}
ServerNotInitialized.prototype = Error.prototype;