/************
 * Requires *
 ************/
var request = require("request");
var AuthenticationController;
var UserController;

var Routes;

function model(name) {
  return Routes.model(name);
}

/*************************
 * Indicator Controller *
 *************************/
var IndicatorController = function(_Routes) {
  if (!(this instanceof IndicatorController)) {
    return new IndicatorController(_Routes);
  }
  
  //Late Asignations
  Routes = _Routes;
  AuthenticationController = require("./authentication_controller")(_Routes);
  UserController = require("./user_controller")(_Routes);
}

IndicatorController.prototype = {
  updateOrCreate: function(ownerId, data, fn) {
    var providerName = data.source.provider.name;
    var sourceId = data.source.id;

    this.find(ownerId, providerName, sourceId, function(indicator) {
      if (!indicator) {
        indicator = new model("indicator")({
          owner: ownerId,
          provider: providerName,
          source: sourceId
        });

        indicator.save(function(err) {
          if (err) {
            throw new Error("(8356) Couldnt create or update an indicator: " + err);
          }
          fn(indicator);
        });
        return;
      }
      fn(indicator);
    });
  },

  updateValues: function(provider, source, callback) {
    var self = this;
    model("indicator").find({
      provider: provider,
      source: source.id
    }, function(err, indicators) {
      for (var i = 0, len = indicators.length; i < len; i++) {
        requestValue(self, provider, source, indicators[i], callback);
      }
    });
  },

  updateValue: function(indicatorId, source, callback) {
    var self = this;
    this.findById(indicatorId, function(indicator) {
      requestValue(self, indicator.provider, source, indicator, callback);
    });
  },

  saveValue: function(indicator, value, time, callback) {
    if (!time) {
      time = new Date();
    }

    var value = new model("value")({
      indicator: indicator,
      value: value,
      date: time
    });

    value.save(function(err, value) {
      if (err) {
        console.log("Couldn´t save a new value on the indicator " + indicator);
      }
    });

    if (callback) callback(null, value);
  },

  getValues: function(indicatorId, source, query, callback) {
    if (typeof query == "function" && !callback) {
      callback = query;
      query = {};
    }
    if (!query || typeof query != 'object') {
      query = {};
    }
    query.indicator = indicatorId;
    var self = this;

    model("value").find(query, function(err, values) {
      if (err) {
        throw new Error("Couldnt get values from the indicator " + indicatorId + "." + err);
      }

      if (values.length == 0) {
        self.updateValue(indicatorId, source, function(err, value) {
          if (value) values.push(value);
          callback(values.map(function(value) {
            return {
              value: value.value,
              date: value.date
            };
          }));
        });
        return;
      }

      callback(values.map(function(value) {
        return {
          value: value.value,
          date: value.date
        };
      }));
    });
  },

  find: function(ownerId, providerName, sourceId, fn) {
    model("indicator").findOne({
      owner: ownerId,
      provider: providerName,
      source: sourceId
    }, function(err, indicator) {
      if (err) {
        throw new Error("(9523) Couldnt find an indicator: " + err);
      }
      fn(indicator);
    });
  },

  findById: function(id, fn) {
    model("indicator").findOne({
      _id: id
    }, function(err, indicator) {
      if (err) {
        console.log("Error: (9522) Couldnt find an indicator: " + err);
        fn(null);
      }
      fn(indicator);
    });
  }
};
module.exports = IndicatorController;


function requestValue(self, provider, source, indicator, callback) {
  if (source.requires_auth) {
    UserController.findById(indicator.owner, function (err, user) {
      if (err) {
        return console.log(err);
      }

      if (user.custom && user.custom.token) {
        return internalRequest(self, provider, source, indicator, user.custom.token, callback);
      }

      if (callback) {
        callback({
          code: 3441,
          message: "Unauthorized on " + provider + "."
        });
      }
    });
  } else {
    internalRequest(self, provider, source, indicator, null, callback);
  }

  function internalRequest(self, provider, source, indicator, access_token, callback) {
    var log = "requesting value of " + provider + '/' + source.id;
    log += ' [indicator:' + indicator._id + ']';
    log += ' [auth:' + (access_token ? 'true' : 'false') + ']';
    console.log(log + '...');

    var options = {
      url: source.url,
      headers: {
        Accept: 'text/plain,application/json',
      }
    };

    if (access_token) {
      options.headers.Authorization = access_token;
    }

    request(options, function(err, res, body) {
      if (err) {
        console.log(err.stack);
        if (callback) callback(err);
        return;
      }
      if (res.statusCode != 200) {
        if (res.statusCode == 401) {
          console.log("Unauthorized. (" + source.url + ")");
          if (callback) callback({
            code: 3441,
            message: "Unauthorized on " + provider + "."
          });
          return;
        }
        console.log("Received a " + res.statusCode + " error. (" + source.url + ")");
        if (callback) callback({
          code: 3442,
          message: "Problem when receiving data from " + provider + "."
        });
        return;
      }

      var json;
      try {
        json = JSON.parse(res.body);
      } catch (e) {
        console.log("\n", "This source data is not a valid json. (" + source.url + ")");
        return;
      }
      console.log(json);
      self.saveValue(indicator, json, Date.now(), callback);
    });
  }
}