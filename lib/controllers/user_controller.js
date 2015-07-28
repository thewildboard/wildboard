/************
 * Requires *
 ************/
var User = require("../models/user");
var bcrypt = require("bcryptjs");

/****************************
 * User Controller Handlers *
 ****************************/
var UserController = {
  signup: function(username, email, password, fn) {
    if (this.areEmptyCredentials(username, password, email)) {
      return fn({
        code: 5343,
        message: 'username, password and email can´t be empty.'
      });
    }

    return User.create({
      local: {
        username: username,
        email: email,
        password: this.generateHash(password)
      }
    }, fn);
  },

  login: function(username, password, fn) {
    this.findByUsername(username, function(err, user) {
      if (err) {
        return fn(null, false, {
          error: 'There was an error.'
        });
      }
      if (!user) {
        return fn(null, false, {
          error: 'Incorrect username or password.'
        });
      } else if (user.isValidPassword(password)) {
        return fn(null, user);
      }
      return fn(null, false, {
        error: 'Incorrect username or password.'
      });
    });
  },

  /**
   *Handlers
   **/
  areEmptyCredentials: function(username, password, email) {
    return !username || !password || !email ||
      username === "" || password === "" || email === "";
  },

  findById: function(id, fn) {
    User.findOne({
      "_id": id
    }, fn);
  },

  findByUsername: function(username, fn) {
    return User.findOne({
      "local.username": username
    }, fn);
  },

  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }
};
module.exports = UserController;