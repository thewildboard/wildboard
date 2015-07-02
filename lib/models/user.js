var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
require("mongo-relation");

var userSchema = mongoose.Schema({
  local: {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.hasMany("Board", {dependent: "delete"});

module.exports = mongoose.model("User", userSchema);