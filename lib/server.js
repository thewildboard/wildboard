module.exports = Server;

/************
 * Requires *
 ************/
express = require("express");
var https = require("https");
var http = require("http");
var bodyParser = require('body-parser');

passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var sessions = require("client-sessions");
var fs = require("fs");

var Routes = require("./routes");
var UserController = require("./controllers/user_controller");

/****************
 * Server Class *
 ****************/
function Server(core, config, callback) {
  var self = this;
  this.core = core;

  this.server = express();

  //Debug
  this.server.on('uncaughtException', function(req, res, route, err) {
    console.error(err.stack);
  });

  this.server.use(express.static('./public', config.server));
  this.server.use(bodyParser.json());
  this.server.use(bodyParser.urlencoded({
    extended: false
  }));

  self.server.use(sessions({
    // cookie name dictates the key name added to the request object
    cookieName: 'session',
    // should be a large unguessable string
    secret: 'mynameisralphwiggum',
    // how long the session will stay valid in ms
    duration: 259200 * 1000
  }));

  self.passportSetup();


  Routes(core, this.server);


  if(config.secure == true) {
    this.instance = https.createServer({
      key: fs.readFileSync(config.express.key),
      cert: fs.readFileSync(config.express.cert),
    }, this.server);
    this.instance.listen(config.port, function() {
      self.log('Listening at ' + config.port);
      if (callback) {
        callback();
      }
    });
  } else {
    this.instance = this.server.listen(config.port, function() {
      self.log('Listening at ' + config.port);
      if (callback) {
        callback();
      }
    });
  }

}

Server.prototype = {
  core: null,
  server: null,
  instance: null,
  routes: null,

  passportSetup: function() {
    // Initialize passport
    this.server.use(passport.initialize());
    // Set up the passport session
    this.server.use(passport.session());

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.
    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      UserController.findById(id, function(err, user) {
        done(err, user);
      });
    });

    // Lookup a user in our database
    var lookupUser = function(username, password, done) {
      UserController.login(username, password, done);
    };

    passport.use(new LocalStrategy({
      usernameField: 'username',
      session: true
    }, lookupUser));
  },

  close: function() {
    if (!this.server) {
      throw new ServerNotInitialized();
    }

    this.instance.close();
    this.log("Closed.");
  },

  log: function(message) {
    if (this.core.mode !== "test") {
      this.core.log("(Server) " + message);
    }
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