/************
 * Requires *
 ************/
var bcrypt = require("bcryptjs");

var Routes;

function model(name) {
  return Routes.model(name);
}

/****************************
 * User Controller Handlers *
 ****************************/
var UserController = function(_Routes) {
  if (!(this instanceof UserController)) {
    return new UserController(_Routes);
  }

  //Late Asignations
  Routes = _Routes;
}

UserController.prototype = {
  auth: function(id, token, fn) {
    model("user").findOne({
      "custom.id": id
    }, function(ferr, user) {
      if (ferr || !user) {
        user = new model("user")({
          custom: {
            id: id,
            token: token
          }
        });
      } else {
        user.custom.token = token;
      }

      user.save(function(err) {
        if (err) {
          throw new Error("(8056) Couldnt auth an user: " + err);
        }
        fn(ferr || err, user);
      });
    });
  },

  signup: function(username, email, password, fn) {
    if (this.areEmptyCredentials(username, password, email)) {
      return fn({
        code: 5343,
        message: 'username, password and email can´t be empty.'
      });
    }

    return model("user").create({
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
    model("user").findOne({
      "_id": id
    }, fn);
  },

  findByUsername: function(username, fn) {
    return model("user").findOne({
      "local.username": username
    }, fn);
  },

  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }
};
module.exports = UserController;