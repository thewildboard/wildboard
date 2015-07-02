module.exports = Server;

/************
 * Requires *
 ************/
restify = require("restify");
passport = require("passport");
var LocalStrategy = require("passport-local");
var fs = require("fs");

//Controllers
UserController = require('./controllers/user_controller');

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
  self.server.on('uncaughtException', function (req, res, route, err) {
      console.error(err.stack);
  });

  self.server.use(restify.queryParser());
  self.server.use(restify.bodyParser({ mapParams: false }));

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
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      UserController.findById(id, function(err, user) {
        done(err, user);
      });
    });

    // Lookup a user in our database
    var lookupUser = function(username, password, done) {
      UserController.findByUsername(username, function(err, user) {
        if (err) {
          return done(null, false, {
            error: 'There was an error.'
          });
        }
        if (!user) {
          return done(null, false, {
            error: 'Incorrect username or password.'
          });
        } else if (user.isValidPassword(password)) {
          return done(null, user);
        }
        return done(null, false, {
          error: 'Incorrect username or password.'
        });
      });
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