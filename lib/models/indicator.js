var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var indicatorSchema = new Schema({
  update_rate: String,

  //User or Organization Id
  owner: {
    type: Schema.ObjectId,
    required: true
  },

  //Provider Name
  provider: {
    type: String,
    required: true
  },

  //Source Id
  source: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Indicator", indicatorSchema);