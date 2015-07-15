var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var identifierSchema = new Schema({
  provider: {
    type: Schema.ObjectId,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  url: {
    type: String,
    required: true,
    unique: true
  },

  updateRate: String
});

module.exports = mongoose.model("Identifier", identifierSchema);