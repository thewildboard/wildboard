module.exports = IO;

/************
 * Requires *
 ************/
var SocketIO = require("socket.io");

/************
 * IO Class *
 ************/
function IO(core, port) {
  var self = this;
  self.core = core;
  var io = this.io = SocketIO(port);

  io.on('connection', function(socket) {});

  self.log("Listening at " + port);
}

IO.prototype = {
  core: null,
  io: null,

  log: function(message) {
    this.core.log("(IO) " + message);
  }
};