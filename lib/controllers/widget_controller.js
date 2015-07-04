/************
 * Requires *
 ************/
var Widget = require("../models/widget");

/****************************
 * Widget Controller Handlers *
 ****************************/
var WidgetController = {
  create: function(boardId, data, fn) {
    Widget.create({
      name: data.name,
      board: boardId
    }, function(err, widget) {
      if (err) {
        return fn({
          code: 460,
          message: "There was an error."
        }, null);
      }
      if (!widget) {
        return fn({
          code: 461,
          message: "Couldn´t create the widget."
        }, null);
      } else {
        return fn(null, widget);
      }
    });
  },

  update: function(boardId, id, data) {

  },

  findAllByBoard: function(boardId, fn) {
    Widget.find({
      board: boardId
    }, fn);
  },

  findById: function(id, boardId, fn) {
    var query;
    if (boardId) {
      query = {
        _id: id,
        board: boardId
      };
    } else {
      query = {
        _id: id
      };
    }
    Widget.findOne(query, fn);
  }
};
module.exports = WidgetController;