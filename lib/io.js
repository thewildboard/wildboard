module.exports = IO;

/************
 * Requires *
 ************/
var SocketIO = require("socket.io");

function IO(core){
  this.core = core;
  var io = this.io = SocketIO(14494);

  io.on('connection', function(socket){
    io.on('login', function(data){
      var username = data.username;
      var password = data.password;
    });

    
  });

}

IO.prototype = {
  core: null,
  io: null,
};