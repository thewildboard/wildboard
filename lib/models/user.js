var mongoose = require("mongoose"),
  relationship = require("mongoose-relationship"),
  bcrypt = require("bcryptjs"),
  Schema = mongoose.Schema;

var userSchema = new Schema({
  local: {
    username: {
      type: String,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true
    },
    password: {
      type: String
    }
  },
  custom: {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    token: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },

  boards: [{
    type: Schema.ObjectId,
    ref: "Board"
  }]
});

userSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.detach = function(board, fn) {
  var index = this.boards.indexOf(board);
  if (index > -1) {
    this.boards.splice(index, 1);
  }

  this.save(fn);
};

userSchema.methods.canCreateBoards = function(){
  //Limit the user dashboards to 4
  return this.boards.length <= 4;
};

module.exports = mongoose.model("User", userSchema);