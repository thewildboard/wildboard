/************
 * Requires *
 ************/
var Identifier = require("../models/identifier");
var Value = require("../models/value");

/*************************
 * Identifier Controller *
 *************************/
var IdentifierController = {
  updateOrCreate: function(source, provider, fn) {
    this.find(source.url, function(identifier) {
      if (!identifier) {
        identifier = new Identifier({
          url: source.url
        });
      }

      identifier.name = source.name;
      identifier.description = source.description;
      identifier.updateRate = source.updateRate;
      identifier.provider = provider._id;

      identifier.save(function(err) {
        if (err) {
          throw new Error("(8356) Couldnt create or update an identifier: "+err);
        }
        fn(identifier);
      });
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

  getValues: function(identifier, query, callback) {
    if (!query || typeof query != 'object') {
      query = {};
    }
    query.identifier = identifierId;
    
    Value.find(query, function(err, value){
      
    });
  },

  find: function(url, fn) {
    Identifier.findOne({
      url: url
    }, function(err, identifier) {
      if (err) {
        throw new Error("(9523) Couldnt find an identifier.");
      }
      fn(identifier);
    });
  }
};
module.exports = IdentifierController;