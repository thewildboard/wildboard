/************
 * Requires *
 ************/
var Board = require("../models/board");

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

  update: function(user, id, data, fn) {

  },

  delete: function(user, id, fn) {

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