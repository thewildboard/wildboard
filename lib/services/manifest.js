var request = require("request");


function Manifest(core, url) {
  this.core = core;

  var self = this;

  request.get(url, function(err, res, body) {
    if (err) {
      console.log(err);
      return;
    }
    if (res.statusCode != 200) {
      self.log("Received an " + res.statusCode + "error. (" + url + ")");
      return;
    }

    var json;
    try {
      json = JSON.parse(res.body);
    } catch (e) {
      self.log("This manifest is not a valid json. (" + url + ")");
      return;
    }
    self.loaded = true;
    self.provider = json.provider;
    self.sources = json.sources;
    self.auth = json.auth;
    self.log("Loaded " + self.provider.name + " manifest.");
  });
}

Manifest.prototype = {
  core: null,
  loaded: false,

  provider: null,
  sources: null,
  auth: null,

  log: function(message) {
    this.core.log("(Manifest) " + message);
  }
};

module.exports = Manifest;