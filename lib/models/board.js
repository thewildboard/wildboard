var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
  name: String,
  user: Schema.Types.ObjectId,
  widgets: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Board', boardSchema);