/************
 * Requires *
 ************/
var Authentication = require("../models/authentication");

/*************************
 * Indicator Controller *
 *************************/
var AuthenticationController = {
  updateOrCreate: function(user, provider, access_token, fn) {
    this.find(user, provider, function(auth) {
      if (!auth) {
        auth = new Authentication({
          user: user,
          provider: provider
        });
      }

      auth.access_token = access_token;

      auth.save(function(err) {
        if (err) {
          throw new Error("(1356) Couldnt create or update an authentication: " + err);
        }
        fn(auth);
      });
    });
  },

  find: function(user, provider, fn) {
    Authentication.findOne({
      user: user,
      provider: provider
    }, function(err, auth) {
      if (err) {
        throw new Error("(4323) Couldnt find an authentication: "+err);
      }
      fn(auth);
    });
  }
};
module.exports = AuthenticationController;