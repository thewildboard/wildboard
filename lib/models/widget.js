var mongoose = require("mongoose");
require("mongo-relation");

var widgetSchema = mongoose.Schema({
  name: String
});

widgetSchema.belongsTo("Board");

module.exports = mongoose.model("Widget", widgetSchema);