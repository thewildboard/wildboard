module.exports = Core;

/************
 * Requires *
 ************/
var util = require("./util");

var Server = require("./server");
var ServeMe = require("serve-me");
var DB = require("./db");
var ManifestManager = require("./manifest_manager");

function Core(mode, port) {
  if (!(this instanceof Core)) {
    return new Core(mode, port);
  }
  var self = this;

  self.mode = mode || "development";
  if (self.mode == 'default') {
    throw new Error("'default' is not a valid environment.");
  }

  self.log("Initializing in mode '" + mode + "'");


  var configEnvs = require("../config");
  if (!configEnvs[mode]) {
    throw new Error("The '" + self.mode + "' config doesnt exist.");
  }
  self.config = Object.merge(configEnvs.default || {}, configEnvs[self.mode] || {});

  this.webServer = ServeMe(this.config.serveme);
  this.webServer.start();

  self.db = new DB(this);
  self.server = new Server(this, port || 3000);

  self.manifests = new ManifestManager(this, this.config);
}

Core.prototype = {
  config: null,
  webServer: null,
  server: null,
  rest: null,
  db: null,
  manifests: null,

  close: function() {
    if (this.server) {
      this.server.close();
    }
  },

  log: function(message, second) {
    if (this.mode !== "test") {
      console.log((second ? message : "") + 'Dashboard: ' + (second ? second : message));
    }
  },

  events: {},

  /**
   * On Event
   * @param  {String}   identifier [name of the event]
   * @param  {Function} callback   [method called when event is active]
   */
  on: function(identifier, callback) {
    if (!identifier || !callback) {
      throw new IncorrectArgumentType("The identifier or callback cant be null.");
    }

    if (!this.events[identifier]) {
      this.events[identifier] = [];
    }

    this.events[identifier].push(callback);
  },

  /**
   * Call Event
   * @param  {String} identifier [name of the event]
   */
  call: function(identifier, data) {
    var events = this.events[identifier];
    if (events) {
      var results = [];
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (typeof event == "function") {
          results.push(event(data));
        }
      }
      return results;
    } else {
      this.log("Trying to call an inexistent event.");
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