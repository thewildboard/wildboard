module.exports = IO;

/************
 * Requires *
 ************/
var SocketIO = require("socket.io");

/************
 * IO Class *
 ************/
function IO(core) {
  var self = this;
  self.core = core;
  var io = this.io = SocketIO(14494);

  io.on('connection', function(socket) {
  });
}

IO.prototype = {
  core: null,
  io: null,
};