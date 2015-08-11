/************
 * Requires *
 ************/
var Provider = require("./services/provider");

/**************************
 * Manifest Manager Class *
 **************************/
function ProviderManager(config) {
  if (!config.manifests || config.manifests.length == 0) {
    throw new Error("Manifests are required to start the WildBoard.");
  }

  //Ignore self signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  var self = this;
  for (var i = 0; i < config.manifests.length; i++) {
    var manifest = config.manifests[i];
    var auth;
    if (typeof manifest === "object") {
      auth = manifest.auth || undefined;
      manifest = manifest.url;
    }

    var provider = new Provider();

    provider.initialize(manifest, auth).then(function(result) {
      if (self.providers.hasOwnProperty(result.name)) {
        throw new Error("There was another manifest with the same name. (" + result.name + ")");
      }
      self.providers[result.name] = result.provider;
    }, function(err){
      console.log(err);
    });

  }
}

ProviderManager.prototype = {
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
    return provider.sources[sourceId];
  },

  log: function(message) {
    Log.log("(Manifest) " + message);
  }
};

module.exports = ProviderManager;