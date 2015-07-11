var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var valueSchema = new Schema({
  identifier: {
    type: Schema.ObjectId,
    required: true,
    unique: true
  }

  value: {
    type: Numeric,
    required: true
  },

  timeStamp: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Value", valueSchema);