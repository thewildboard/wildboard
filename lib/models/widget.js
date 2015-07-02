var mongoose = require("mongoose"),
    relationship = require("mongoose-relationship"),
    Schema = mongoose.Schema;

var widgetSchema = new Schema({
  name: String,
  board: {
    type: Schema.ObjectId,
    ref: "Board",
    childPath: "widgets"
  }
});

widgetSchema.plugin(relationship, { relationshipPathName: "board" });

module.exports = mongoose.model("Widget", widgetSchema);