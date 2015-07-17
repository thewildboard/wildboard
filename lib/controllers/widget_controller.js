/************
 * Requires *
 ************/
var Widget = require("../models/widget");
var IndicatorController = require("./indicator_controller");

/****************************
 * Widget Controller Handlers *
 ****************************/
var WidgetController = {
  create: function(userId, boardId, data, fn) {
    var self = this;
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
        if (data.indicator) {
          createAndAssignIndicator(userId, widget, data.indicator, fn);
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

function createAndAssignIndicator(userId, widget, data, fn){
  IndicatorController.updateOrCreate(userId, data, function(indicator) {
    if (!indicator) {
      fn({
        code: 9325,
        message: "Couldn´t create the indicator."
      });
    }
    widget.indicator = indicator._id;
    widget.save(function(err){
      if(err){
        throw new Error("Couldnt save the widget.");
      }
      fn(null, widget);
    });
  });
};