/************
 * Requires *
 ************/
var bcrypt = require('bcryptjs');

/****************************
 * User Controller Handlers *
 ****************************/
UserController = {
  checkEmptyCredentials: function(username, password) {
    return !username || !data.password || username === "" || data.password === "";
  },

  findById: function(id, fn) {
    //Find on the db
    var idx = id - 1;
    if (users[idx]) {
      fn(null, users[idx]);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  },

  findByUsername: function(username, fn) {
    //Find on the db

    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  }
};