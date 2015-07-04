var mongoose = require("mongoose"),
  relationship = require("mongoose-relationship"),
  Schema = mongoose.Schema;

var boardSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    childPath: "boards"
  },
  widgets: [{
    type: Schema.ObjectId,
    ref: "Widget"
  }]
});

boardSchema.methods.getPublicJson = function() {
  return {
    id: this._id,
    name: this.name,
  };
};

boardSchema.plugin(relationship, {
  relationshipPathName: "user"
});

module.exports = mongoose.model("Board", boardSchema);