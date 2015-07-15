/************
 * Requires *
 ************/
var Provider = require("../models/provider");

/***********************
 * Provider Controller *
 ***********************/
var ProviderController = {

  updateOrCreate: function(data, fn) {
    this.find(data.name, function(provider) {
      if (!provider) {
        m_provider = new Provider({});
      }

      provider.name = data.name;
      provider.url = data.url;

      provider.save(function(err) {
        if (err) throw new Error("(3856) Couldnt create or update a provider.");
        fn(provider);
      });
    });
  },

  find: function(name, fn) {
    Provider.findOne({
      name: name
    }, function(err, provider) {
      if (err) {
        throw new Error("(9563) COuldnt find a provider.");
      }
      fn(provider);
    });
  }
};
module.exports = ProviderController;
