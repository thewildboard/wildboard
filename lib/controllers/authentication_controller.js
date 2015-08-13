/************
 * Requires *
 ************/
var Authentication = require("../models/authentication");

var Routes;

function model(name){
  return Routes.model(name);
}

/*************************
 * Indicator Controller *
 *************************/
 var AuthenticationController = function(_Routes){
  if (!(this instanceof AuthenticationController)) {
    return new AuthenticationController(_Routes);
  }

  //Late Asignations
  Routes = _Routes;
}

AuthenticationController.prototype = {
  updateOrCreate: function(user, provider, access_token, fn) {
    this.find(user, provider, function(auth) {
      if (!auth) {
        auth = new model("authentication")({
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
    model("authentication").findOne({
      user: user,
      provider: provider
    }, function(err, auth) {
      if (err) {
        throw new Error("(4323) Couldnt find an authentication: " + err);
      }
      fn(auth);
    });
  },

  getToken: function(user, provider, fn) {
    this.find(user, provider, function(auth){
      fn(auth? (auth.access_token || "") : "");
    });
  }
};
module.exports = AuthenticationController;