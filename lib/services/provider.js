/************
 * Requires *
 ************/
var request = require("request");
var CronJob = require('cron').CronJob;

var IdentifierController = require("../controllers/identifier_controller");

/******************
 * Manifest Class *
 ******************/
function Provider(core, url, fn) {
  this.core = core;

  var self = this;

  this.update(url, function(err, update_rate) {
    if (!err) {
      console.log("  Update rate: " + update_rate);
      //Prepare autoUpdate to update at the specified time or every day
      new CronJob(update_rate, function() {
        self.update(url);
      }, null, true, "America/Los_Angeles");

      fn(self.name, self);
    }
  })
}

Provider.prototype = {
  core: undefined,
  loaded: false,

  name: undefined,
  url: undefined,

  update_rate: "00 00 00 * * *",
  sources: undefined,
  auth: undefined,

  update: function(url, callback) {
    var self = this;

    request.get(url, function(err, res, body) {
      if (err) {
        console.log(err);
        if (callback) callback(err);
        return;
      }
      if (res.statusCode != 200) {
        self.log("\n", "Received an " + res.statusCode + "error. (" + url + ")");
        if (callback) callback(err);
        return;
      }

      var json;
      try {
        json = JSON.parse(res.body);
      } catch (e) {
        self.log("\n", "This manifest is not a valid json. (" + url + ")");
        if (callback) callback(err);
        return;
      }

      if (self.hasChanged(json)) {
        self.loaded = true;

        self.name = json.provider.name;
        self.url = json.provider.url;

        self.sources = json.sources;
        self.auth = json.auth;
        //Not need to updating rates but...
        self.update_rate = json.update_rate || self.update_rate;

        self.log("\n", "Loaded " + self.name);
      } else {
        self.log("\n", "Not need to reload " + self.name);
      }

      if (callback) callback(err, self.update_rate);
    });
  },

  hasChanged: function(json) {
    if (!equals(this.name, json.provider.name) ||
      !equals(this.url, json.provider.url) ||
      !equals(this.sources, json.sources) ||
      !equals(this.auth, json.auth)) {
      return true;
    }
    return false;
  },

  load: function() {
    var self = this;

    /*
    ProviderController.updateOrCreate(this.provider, function(m_provider) {
      for (var i = 0; i < self.sources.length; i++) {
        var source = self.sources[i];
        IdentifierController.updateOrCreate(source, m_provider, function(identifier) {
          console.log("  Loaded source '"+identifier.name+"' from "+m_provider.name);
        });
      }
    });
    */
  },


  log: function(first, second) {
    this.core.log(second ? first : "", "(Manifest) " + (second ? second : first));
  }
};
module.exports = Provider;


function equals(first, second) {
  return JSON.stringify(first) == JSON.stringify(second);
}