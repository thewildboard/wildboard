var request = require("request");


function Manifest(core, url) {
  this.core = core;

  request.get(url, function(err, res, body) {
    console.log(err);
    if (err) {
      this.log(err);
      return;
    }
    if (res.statusCode != 200) {
      this.log("Received an " + res.statusCode + "error. ("+url+")");
      return;
    }

    var json;
    try{
      json = JSON.parse(res.body);
    } catch(e) {
      this.log("This manifest is not a valid json. ("+url+")");
      return;
    }

    this.provider = json.provider;
    this.sources = json.sources;
    this.auth = json.auth;

  });
}

Manifest.prototype = {
  core: null,

  provider: null,
  sources: null,
  auth: null,

  log: function(message){
    this.core.log("(Manifest) "+message);
  }
};

module.exports = Manifest;