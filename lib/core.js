module.exports = Core;

/************
 * Requires *
 ************/
var Server = require("./server");
var DB = require("./db");
var IO = require("./io");

function Core(mode, port) {
  if (!(this instanceof Core)) {
    return new Core(mode, port);
  }
  var self = this;

  self.mode = mode || "development";
  self.log("Initializing...");

  self.db = new DB(this);
  self.server = new Server(this, port || 3000);
}

Core.prototype = {
  server: null,
  rest: null,
  db: null,

  close: function() {
    if (this.server) {
      this.server.close();
    }
  },

  log: function(message) {
    if (this.mode !== "test") {
      console.log('Dashboard: ' + message);
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