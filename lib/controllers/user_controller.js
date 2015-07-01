/************
 * Requires *
 ************/
var User = require("../models/user");

/****************************
 * User Controller Handlers *
 ****************************/
var UserController = {
  signup: function(username, email, password, fn) {
    if (this.areEmptyCredentials(username, password, email)) {
      return fn(null, false, {
        error: 'username, password and email can´t be empty.'
      });
    }
    return User.create({
      local: {
        username: username,
        email: email,
        password: password
      }
    }, fn);
  },

  login: function(username, email, password, fn) {

  },

  areEmptyCredentials: function(username, password, email) {
    return !username || !password || !email ||
      username === "" || password === "" || email === "";
  },

  findById: function(id, fn) {
    User.findOne({
      "id": id
    }, fn);
  },

  findByUsername: function(username, fn) {
    return User.findOne({
      "username": username
    }, fn);
  }
};
module.exports = UserController;