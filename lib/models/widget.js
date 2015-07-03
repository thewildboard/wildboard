var mongoose = require("mongoose"),
    relationship = require("mongoose-relationship"),
    Schema = mongoose.Schema;

var widgetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  board: {
    type: Schema.ObjectId,
    ref: "Board",
    childPath: "widgets"
  }
});

widgetSchema.plugin(relationship, { relationshipPathName: "board" });

module.exports = mongoose.model("Widget", widgetSchema);