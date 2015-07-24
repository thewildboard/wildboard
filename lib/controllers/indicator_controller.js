/************
 * Requires *
 ************/
var request = require("request");

var Indicator = require("../models/indicator");
var Value = require("../models/value");
var AuthenticationController = require("./authentication_controller");

/*************************
 * Indicator Controller *
 *************************/
var IndicatorController = {
  updateOrCreate: function(ownerId, data, fn) {
    var providerName = data.source.provider.name;
    var sourceId = data.source.id;

    this.find(ownerId, providerName, sourceId, function(indicator) {
      if (!indicator) {
        indicator = new Indicator({
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
    Indicator.find({
      provider: provider,
      source: source.id
    }, function(err, indicators) {
      for (var i = 0, len = indicators.length; i < len; i++) {
        requestValue(self, provider, source, indicators[i], callback);
      }
    });
  },

  updateValue: function(indicatorId, callback) {
    var self = this;
    this.findById(indicatorId, function(indicator) {
      requestValue(self, indicator.provider, indicator.source, indicator, callback);
    });
  },

  saveValue: function(indicator, value, time, callback) {
    if (!time) {
      time = new Date();
    }

    var value = Value.new({
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

  getValues: function(indicatorId, query, callback) {
    if (typeof query == "function" && !callback) {
      callback = query;
      query = {};
    }
    if (!query || typeof query != 'object') {
      query = {};
    }
    query.indicator = indicatorId;

    Value.find(query, function(err, values) {
      if (err) {
        throw new Error("Couldnt get values from the indicator " + indicatorId + "." + err);
      }

      if (values.length == 0) {
        IndicatorController.updateValue(indicatorId, function(err, value) {
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
    Indicator.findOne({
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
    Indicator.findOne({
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
  AuthenticationController.getToken(indicator.owner, provider, function(access_token) {
    if (access_token === "") {
      if(callback) callback({
        code: 3441,
        message: "Unauthorized on " + provider + "."
      });
      return;
    }

    request({
      url: source.url,
      headers: {
        Authorization: "Bearer " + access_token
      },
    }, function(err, res, body) {
      if (err) {
        console.log(err);
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

      self.saveValue(indicator, json, Date.now(), callback);
    });
  });
}