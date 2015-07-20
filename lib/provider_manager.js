/************
 * Requires *
 ************/
var Provider = require("./services/provider");

/**************************
 * Manifest Manager Class *
 **************************/
function ProviderManager(core, config) {
  if (!config.manifests || config.manifests.length == 0) {
    throw new Error("Manifests are required to start the WildBoard.");
  }

  this.core = core;

  //Ignore self signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  var self = this;
  for (var i = 0; i < config.manifests.length; i++) {
    new Provider(core, config.manifests[i], function(name, provider) {
      self.providers[name] = provider;
    });
  }
}

ProviderManager.prototype = {
  core: null,
  providers: {},

  find: function(name) {
    return this.providers[name];
  },

  all: function() {
    return this.providers;
  },

  findSource: function(name, sourceId) {
    var provider = this.providers[name];
    if (!provider) return;
    
    if (typeof sourceId == "string") {
      var provider = this.providers[name];
      if (!provider) return;
      for (var i = 0; i < provider.sources.length; i++) {
        var source = provider.sources[i];
        if (source.id == sourceId) {
          return source;
        }
      }
      return;
    } else {
      return provider.sources[sourceId];
    }
  },

  log: function(message) {
    this.core.log("(Manifest) " + message);
  }
};

module.exports = ProviderManager;