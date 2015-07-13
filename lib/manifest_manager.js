/************
 * Requires *
 ************/
var Manifest = require("./services/manifest");

/**************************
 * Manifest Manager Class *
 **************************/
function ManifestManager(core, config){
  if(!config.manifests || config.manifests.length == 0) {
    throw new Error("Manifests are required to start the WildBoard.");
  }

  this.core = core;

  //Ignore self signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  for(var i = 0; i < config.manifests.length; i++) {
    var manifest = new Manifest(core, config.manifests[i]);
  }
}

ManifestManager.prototype = {
  core: null,

  log: function(message){
    this.core.log("(Manifest) "+message);
  }
};

module.exports = ManifestManager;