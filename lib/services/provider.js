"use strict";
/************
 * Requires *
 ************/
var request = require("request");
var CronJob = require('cron').CronJob;
var Promise = require("promise");

var IndicatorController = require("../controllers/indicator_controller");

/******************
 * Manifest Class *
 ******************/
function Provider() {}

Provider.prototype = {
  core: undefined,
  loaded: false,

  name: undefined,
  url: undefined,
  refresh_rate: "00 00 00 * * *",

  sources: {},
  auth: undefined,

  sourceJobs: {},

  initialize: function(core, url, auth) {
    this.core = core;
    this.auth = auth;
    var self = this;

    return new Promise(function(fulfill, reject) {
      self.update(url, function(err, refresh_rate) {
        if (!err) {
          console.log("  Update rate: " + refresh_rate);
          //Prepare autoUpdate to update at the specified time or every day
          new CronJob(refresh_rate, function() {
            self.update(url);
          }, null, true);

          fulfill(self.name);
        } else {
          reject(err);
        }
      });
    });
  },

  update: function(url, callback) {
    var self = this;
    request.get(url, function(err, res, body) {
      if (err) {
        console.log(err);
        if (callback) callback(err);
        return;
      }
      if (res.statusCode != 200) {
        self.log("\n", "Received a " + res.statusCode + " error. (" + url + ")");
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

        self.loadSources(json);

        //Not need to updating rates but...
        self.refresh_rate = json.refresh_rate || self.refresh_rate;

        self.log("\n", "Loaded " + self.name);
      } else {
        self.log("\n", "Not need to reload " + self.name);
      }

      if (callback) callback(err, self.refresh_rate);
    });
  },

  /**
   * Comprovates that the manifest changed
   * @param  {Object}  json [new manifest]
   * @return {Boolean}      [changed or not]
   */
  hasChanged: function(json) {
    if (!equals(this.name, json.provider.name) ||
      !equals(this.url, json.provider.url) ||
      !equals(this.sources, json.sources)) {
      return true;
    }
    return false;
  },

  /**
   * Load a new source
   * @param  {Object} json [new manifest]
   */
  loadSources: function(json) {
    //Stop cron jobs
    for (var k in this.sourceJobs) {
      this.sourceJobs[k].Stop();
    }
    this.sourceJobs = {};
    this.sources = {}
    //Load new sources
    for (var s in json.sources) {
      var source = json.sources[s];
      this.sources[source.id] = source;
      createCron(this, this.name, source);
    }
  },

  /**
   * Log method
   * @param  {String} first  [message at the back of the log]
   * @param  {String} second [if second is not null, it will be at the back]
   */
  log: function(first, second) {
    this.core.log(second ? first : "", "(Provider) " + (second ? second : first));
  }
};
module.exports = Provider;

function createCron(self, provider, source) {
  IndicatorController.updateValues(provider, source);
  //Dont create a job if it doesnt have a refresh rate
  if (source.refresh_rate) {
    try {
      self.sourceJobs[source.id] = new CronJob(source.refresh_rate, function() {
        //Update all the indicators
        IndicatorController.updateValues(provider, source);
      }, null, true);
    } catch (e) {
      console.log("ERROR: Invalid cron format of '" + source.refresh_rate + "': " + e);
    }
  }
}

function equals(first, second) {
  return JSON.stringify(first) == JSON.stringify(second);
}