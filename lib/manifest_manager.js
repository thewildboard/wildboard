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

  for(var i = 0; i < config.manifests; i++) {
    var manifest = new Manifest(core, config.manifests[i]);
  }
}

ManifestManager.prototype = {

};

module.exports = ManifestManager;