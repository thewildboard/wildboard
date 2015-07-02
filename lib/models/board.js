var mongoose = require("mongoose");
require("mongo-relation");

var boardSchema = mongoose.Schema({
  name: String
});

boardSchema.belongsTo("User");
boardSchema.hasMany("Widget", {dependent: "delete"});

module.exports = mongoose.model("Board", boardSchema);