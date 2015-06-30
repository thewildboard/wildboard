module.exports = REST;

/************
 * Requires *
 ************/
var cookieParser = require('cookie-parser');
var session = require('express-session');

/************
 * Rest Class *
 ************/
function REST(core, app) {
  this.core = core;
  this.app = app;

  app.use(cookieParser());
  app.use(session({
    secret: 'kittyKiller',
    saveUninitialized: true,
    resave: true
  }));

  app.get('/api/dashboard', function(req, res) {
    res.send('Say hello to the dashboard!');
  });

  app.post('/api/signup', function(req, res) {
  });

  app.post('/api/login', function(req, res) {
  });



  app.get('/api/logout', function(req, res) {
  });

  this.log("Loaded API");
}

REST.prototype = {
  core: null,

  app: null,

  log: function(message) {
    this.core.log("(Rest) " + message)
  }
};