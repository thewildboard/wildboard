module.exports = Server;

/************
 * Requires *
 ************/
restify = require("restify");
restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');

passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var sessions        = require("client-sessions");
var fs = require("fs");

/****************
 * Server Class *
 ****************/
function Server(core, port) {
  var self = this;
  self.core = core;

  self.server = restify.createServer({
    key: fs.readFileSync('./ssl/server-key.pem'),
    certificate: fs.readFileSync('./ssl/server-cert.pem'),
  });

  //Debug
  self.server.on('uncaughtException', function(req, res, route, err) {
    console.error(err.stack);
  });

  self.server.use(restify.CORS());
  self.server.use(restify.queryParser());
  self.server.use(restify.bodyParser({
    mapParams: false
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


  require("./routes")(core, this.server);

  self.server.listen(port, function() {
    self.log('Listening at ' + port);
  });
}

Server.prototype = {
  core: null,
  server: null,

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

    this.server.close();
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