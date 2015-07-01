var mongoose = require('mongoose');

var widgetSchema = mongoose.Schema({
  name: String,
  board: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Widget', widgetSchema);