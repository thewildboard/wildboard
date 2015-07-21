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

  position: {
    col: {
      type: Number,
      default: 0
    },
    row: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    }
  },

  indicator: Schema.ObjectId
});

widgetSchema.methods.getPublicJson = function() {
  return {
    id: this._id,
    name: this.name,
    position: {
      col: this.position.col,
      row: this.position.row,
      width: this.position.width,
      height: this.position.height
    }
  };
};

widgetSchema.plugin(relationship, {
  relationshipPathName: "board"
});

var Widget = mongoose.model("Widget", widgetSchema);

Widget.schema.path('position.width').validate(function (value) {
  return value >= 1;
}, 'Smaller than allowed.');
Widget.schema.path('position.height').validate(function (value) {
  return value >= 1;
}, 'Smaller than allowed.');

module.exports = Widget;
