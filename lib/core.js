module.exports = Core;

/************
 * Requires *
 ************/
var util = require("./util");

var Server = require("./server");
var DB = require("./db");
var ProviderManager = require("./provider_manager");

function Core(mode, port) {
  if (!(this instanceof Core)) {
    return new Core(mode, port);
  }

  this.mode = mode || "development";
  if (this.mode == 'default') {
    throw new Error("'default' is not a valid environment.");
  }

  this.log("Initializing in mode '" + mode + "'");

  var configEnvs = require("../config");
  if (!configEnvs[mode]) {
    throw new Error("The '" + this.mode + "' config doesnt exist.");
  }
  this.config = Object.merge(configEnvs.default || {}, configEnvs[this.mode] || {});

  //Mongoose
  this.db = new DB(this);

  //Manifests
  this.providerManager = new ProviderManager(this, this.config);

  //API server
  this.server = new Server(this, this.config);
}

Core.prototype = {
  mode: null,
  config: null,
  server: null,
  db: null,
  providerManager: null,

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
   * @param  {String}   indicator [name of the event]
   * @param  {Function} callback   [method called when event is active]
   */
  on: function(indicator, callback) {
    if (!indicator || !callback) {
      throw new IncorrectArgumentType("The indicator or callback cant be null.");
    }

    if (!this.events[indicator]) {
      this.events[indicator] = [];
    }

    this.events[indicator].push(callback);
  },

  /**
   * Call Event
   * @param  {String} indicator [name of the event]
   */
  call: function(indicator, data) {
    var events = this.events[indicator];
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