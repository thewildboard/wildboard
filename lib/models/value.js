var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var valueSchema = new Schema({
  indicator: {
    type: Schema.ObjectId,
    required: true
  },

  value: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Value", valueSchema);