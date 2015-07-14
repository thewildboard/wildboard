var request = require("request");
var CronJob = require('cron').CronJob;

function Manifest(core, url) {
  this.core = core;

  var self = this;

  this.update(url, function(err, updateRate) {
    if (!err) {
      console.log("    UpdateRate: "+updateRate);
      //Prepare autoUpdate to update at the specified time or every day
      new CronJob(updateRate, function() {
        self.update(url);
      }, null, true, "America/Los_Angeles");
    }
  })
}

Manifest.prototype = {
  core: null,
  loaded: false,

  updateRate: "00 00 00 * * *",
  provider: null,
  sources: null,
  auth: null,

  update: function(url, callback) {
    var self = this;

    request.get(url, function(err, res, body) {
      if (err) {
        console.log(err);
        if (callback) callback(err);
        return;
      }
      if (res.statusCode != 200) {
        self.log("Received an " + res.statusCode + "error. (" + url + ")");
        if (callback) callback(err);
        return;
      }

      var json;
      try {
        json = JSON.parse(res.body);
      } catch (e) {
        self.log("This manifest is not a valid json. (" + url + ")");
        if (callback) callback(err);
        return;
      }

      if (self.hasChanged(json)) {
        self.load(json);
        self.loaded     = true;
        self.provider   = json.provider;
        self.sources    = json.sources;
        self.auth       = json.auth;
        self.updateRate = json.updateRate || self.updateRate;

        self.log("Loaded " + self.provider.name);
      } else {
        self.log("Not need to reload " + self.provider.name);
      }

      if (callback) callback(err, self.updateRate);
    });
  },

  hasChanged: function(json) {
    if (!equals(this.provider, json.provider) ||
      !equals(this.sources, json.sources) ||
      !equals(this.auth, json.auth)) {
      return true;
    }
    return false;
  },

  load: function(json) {
    for (var i = 0; i < json.sources; i++) {
      var source = json.sources[i];

    }
  },

  log: function(message) {
    this.core.log("\n", "(Manifest) " + message);
  }
};
module.exports = Manifest;

function equals(first, second){
  return JSON.stringify(first) == JSON.stringify(second);
}