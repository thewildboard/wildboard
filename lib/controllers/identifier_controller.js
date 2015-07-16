/************
 * Requires *
 ************/
var Identifier = require("../models/identifier");
var Value = require("../models/value");

/*************************
 * Identifier Controller *
 *************************/
var IdentifierController = {
  updateOrCreate: function(ownerId, data, fn) {
    var providerName = data.source.provider.name;
    var sourceId = data.source.id;

    this.find(ownerId, providerName, sourceId, function(identifier) {
      if (!identifier) {
        identifier = new Identifier({
          owner: ownerId,
          provider: providerName,
          source: sourceId
        });

        identifier.save(function(err) {
          if (err) {
            throw new Error("(8356) Couldnt create or update an identifier: " + err);
          }
          fn(identifier);
        });
        return;
      }
      fn(identifier);
    });
  },

  saveValue: function(identifier, value, time) {
    if (!time) {
      time = new Date();
    }
    Value.create({
      identifier: identifier,
      value: value,
      timeStamp: time
    }, function(err) {
      if (err) {
        console.log("Couldnt save a new value on the identifier " + identifier);
      }
    });
  },

  getValues: function(identifierId, query, callback) {
    if (!query || typeof query != 'object') {
      query = {};
    }
    query.identifier = identifierId;

    Value.find(query, function(err, values) {
      if (err) {
        throw new Error("Couldnt get values from the identifier " + identifierId + "." + err);
      }
      callback(values);
    });
  },

  find: function(ownerId, providerName, sourceId, fn) {
    Identifier.findOne({
      owner: ownerId,
      provider: providerName,
      source: sourceId
    }, function(err, identifier) {
      if (err) {
        throw new Error("(9523) Couldnt find an identifier: "+err);
      }
      fn(identifier);
    });
  }
};
module.exports = IdentifierController;