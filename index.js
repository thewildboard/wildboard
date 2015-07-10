Core = require('./lib/core.js');

var args = process.argv.slice(2);

var port;
if(args[0] == "--port")
{
  port = args[1];
}

Core("development", port);