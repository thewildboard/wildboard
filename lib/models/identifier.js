var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var identifierSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Identifier", identifierSchema);