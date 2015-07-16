/************
 * Requires *
 ************/
var Widget = require("../models/widget");
var IdentifierController = require("./identifier_controller");

/****************************
 * Widget Controller Handlers *
 ****************************/
var WidgetController = {
  create: function(userId, boardId, data, fn) {
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
        if (data.identifier) {
          IdentifierController.updateOrCreate(userId, data.identifier, function(identifier) {
            if (!identifier) {
              fn({
                code: 9325,
                message: "Couldn´t create the identifier."
              });
            }
            fn(null, widget);
          });
          return;
        }

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

  findById: function(id, fn) {
    Widget.findOne({
        _id: id
    }, fn);
  }
};
module.exports = WidgetController;