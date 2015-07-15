/************
 * Requires *
 ************/
var Identifier = require("../models/identifier");
var Value = require("../models/value");

/*************************
 * Identifier Controller *
 *************************/
var IdentifierController = {
  updateOrCreate: function(data, fn) {
    if(!data.url){
      throw new Error("(5332) Identifier url cant be null or undefined");
    }

    Identifier.update({
      url: data.url
    }, data, {
      upsert: true
    }, fn);
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
    Value.find(query, callback);
  }
};
module.exports = IdentifierController;
