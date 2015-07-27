/************
 * Requires *
 ************/
var Board = require("../models/board");
var WidgetController = require("./widget_controller");

/****************************
 * Board Controller Handlers *
 ****************************/
var BoardController = {
  create: function(user, data, fn) {
    //Limit the user dashboards to 4
    if (user.boards.length >= 4) {
      return fn({
        message: "Can´t create more boards."
      }, null);
    }

    Board.create({
      name: data.name,
      user: user._id
    }, function(err, board) {
      if (err) {
        return fn({
          code: 430,
          message: "There was an error. (430)"
        }, null);
      }
      if (!board) {
        return fn({
          code: 431,
          message: "There was an error. (431)"
        }, null);
      } else {
        return fn(null, board);
      }
    });
  },

  update: function(id, data, fn) {
    if (!data.name || data.name === "") {
      return fn({
        code: 7454,
        message: "The new name cant be empty.",
      });
    }
    Board.update({
      _id: id
    }, {
      name: data.name
    }, function(err, numAffected) {
      if (err) {
        fn(404, {
          code: 3543,
          message: "Couldn´t update the board.",
        });
      } else if (numAffected == 0) {
        fn(404, {
          code: 3544,
          message: "Couldn´t update the board.",
        });
      } else {
        fn(200, {
          message: "Updated " + data.name
        });
      }
    });
  },

  remove: function(id, fn) {
    Board.remove({
      _id: id
    }, fn);
  },

  findAllByUser: function(user, fn) {
    Board.find({
      user: user._id
    }, fn);
  },

  findById: function(id, fn) {
    Board.findOne({
      _id: id
    }, fn);
  }
};
module.exports = BoardController;