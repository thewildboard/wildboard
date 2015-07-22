var fs = require('fs-extra');

var Core = require('./lib/core.js');

var args = process.argv.slice(2);

var port;
var envelopment = "development";

function start() {
  for (var i = 0; i < args.length; i++) {
    if (args[i] === "--port" || args[i] === "-p") {
      //port command
      i++;
      port = args[i];
    } else if (args[i] === "--env" || args[i] === "-e") {
      //environment command
      i++;
      envelopment = args[i];
    } else if (args[i] === "--generate" || args[i] === "-g") {
      i++;
      if (args[i] === "config") {
        generateConfig();
        return;
      }
      console.log("Invalid command:\n  COMMAND -g config");
      process.exit(0);
    }
  }
  Core(envelopment, port);
}

function generateConfig() {
  console.log("Generating config...");
  fs.copy('docs/configExample.js', 'config.js', {
    clobber: true
  }, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Done!");
    }
    process.exit(0);
  });
}

start();