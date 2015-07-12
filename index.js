Core = require('./lib/core.js');

var args = process.argv.slice(2);

var port;
var envelopment = "development";

for (var i = 0; i < args.length; i++) {
  if (args[i] == "--port" || args[i] == "-p") {
    port = args[i+1];
    i++;
  } else if (args[i] == "--env" || args[i] == "-e") {
    envelopment = args[i+1];
    i++;
  }
}

Core(envelopment, port);