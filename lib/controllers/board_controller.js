/************
 * Requires *
 ************/
var WidgetController = require("./widget_controller");

/****************************
 * Board Controller Handlers *
 ****************************/
var BoardController = {
  create: function(db, user, data, fn) {
    if (!user.canCreateBoards()) {
      return fn({
        message: "Can´t create more boards."
      }, null);
    }

    db.board.create({
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

  update: function(db, id, data, fn) {
    if (!data.name || data.name === "") {
      return fn({
        code: 7454,
        message: "The new name cant be empty.",
      });
    }
    db.board.update({
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

  remove: function(db, user, id, fn) {
    db.board.remove({
      _id: id
    }, function(err) {
      if (err) {
        fn(err);
        return;
      }
      user.detach(id, function(err) {
        if (err) {
          fn(err);
          return;
        }
        WidgetController.removeByBoard(db.widget, id, fn);
      });
    });
  },

  findAllByUser: function(Board, user, fn) {
    Board.find({
      user: user._id
    }, fn);
  },

  findById: function(Board, id, fn) {
    Board.findOne({
      _id: id
    }, fn);
  }
};
module.exports = BoardController;