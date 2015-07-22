/************
 * Requires *
 ************/
var request = require("request");

var Indicator = require("../models/indicator");
var Value = require("../models/value");

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

  updateValues: function(provider, source, callback){
    Indicator.find({
      provider: provider,
      source: source.index
    }, function(err, indicators){
      for (var i = 0, len = indicators.length; i < len; i++) {
        request.get(source.url, function(err, res, body) {
          if (err) {
            console.log(err);
            if (callback) callback(err);
            return;
          }
          if (res.statusCode != 200) {
            if(res.statusCode == 401) {
              console.log("Unauthorized. (" + source.url + ")");
              if (callback) callback({
                code: 3441,
                message: "Unauthorized on this " + provider + "."
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

          saveValue(indicators[i], json, Date.now());

          if (callback) callback(err);
        });
      }
    });
  },

  saveValue: function(indicator, value, time) {
    if (!time) {
      time = new Date();
    }
    Value.create({
      indicator: indicator,
      value: value,
      timeStamp: time
    }, function(err) {
      if (err) {
        console.log("Couldnt save a new value on the indicator " + indicator);
      }
    });
  },

  getValues: function(indicatorId, query, callback) {
    if(typeof query == "function" && !callback){
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
      callback(values);
    });
  },

  find: function(ownerId, providerName, sourceId, fn) {
    Indicator.findOne({
      owner: ownerId,
      provider: providerName,
      source: sourceId
    }, function(err, indicator) {
      if (err) {
        throw new Error("(9523) Couldnt find an indicator: "+err);
      }
      fn(indicator);
    });
  },

  findById: function(id, fn){
    Indicator.findOne({
      _id: id
    }, function(err, indicator){
      if(err){
        console.log("Error: (9522) Couldnt find an indicator: "+err);
        fn(null);
      }
      fn(indicator);
    });
  }
};
module.exports = IndicatorController;