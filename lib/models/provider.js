var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var providerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  
  url: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Provider", providerSchema);