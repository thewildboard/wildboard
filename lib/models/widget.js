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
  },

  identifiers: [Schema.ObjectId]
});

widgetSchema.methods.getPublicJson = function() {
  return {
    id: this._id,
    name: this.name,
  };
};

widgetSchema.plugin(relationship, {
  relationshipPathName: "board"
});

module.exports = mongoose.model("Widget", widgetSchema);