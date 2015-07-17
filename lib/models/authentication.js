var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var authenticationSchema = new Schema({
  update_rate: String,

  provider: {
    type: String,
    required: true
  },

  access_token: {
    type: String,
    required: true,
    unique: true
  },

  user: {
    type: Schema.ObjectId,
    required: true
  }
});

module.exports = mongoose.model("Authentication", authenticationSchema);