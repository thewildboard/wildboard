/************
 * Requires *
 ************/
var request = require("request");
var CronJob = require('cron').CronJob;

var IndicatorController = require("../controllers/indicator_controller");

/******************
 * Manifest Class *
 ******************/
function Provider(core, url, fn) {
  this.core = core;

  var self = this;

  this.update(url, function(err, refresh_rate) {
    if (!err) {
      console.log("  Update rate: " + refresh_rate);
      //Prepare autoUpdate to update at the specified time or every day
      new CronJob(refresh_rate, function() {
        self.update(url);
      }, null, true);

      fn(self.name, self);
    }
  })
}

Provider.prototype = {
  core: undefined,
  loaded: false,

  name: undefined,
  url: undefined,
  refresh_rate: "00 00 00 * * *",

  sources: undefined,
  auth: undefined,

  sourceJobs: [],

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
        self.refresh_rate = json.refresh_rate || self.refresh_rate;

        self.load();

        self.log("\n", "Loaded " + self.name);
      } else {
        self.log("\n", "Not need to reload " + self.name);
      }

      if (callback) callback(err, self.refresh_rate);
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
    var i;
    if (this.sourceJobs.length != 0) {
      for (i = 0; i < this.sourceJobs.length; i++) {
        this.sourceJobs[i].Stop();
      }
      this.sourceJobs = [];
    }

    for (i = 0; i < this.sources.length; i++) {
      var source = this.sources[i];
      //Dont create a job if it doesnt have a refresh rate
      if(source.refresh_rate) {
        try {
          this.sourceJobs.push(new CronJob(source.refresh_rate, function() {
            //Update all the indicators
          }, null, true));
        } catch (e) {
          console.log("ERROR: Invalid cron format of '" + source.refresh_rate + "'");
        }
      }
    }
  },


  log: function(first, second) {
    this.core.log(second ? first : "", "(Manifest) " + (second ? second : first));
  }
};
module.exports = Provider;


function equals(first, second) {
  return JSON.stringify(first) == JSON.stringify(second);
}