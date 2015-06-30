/************
 * Requires *
 ************/
var bcrypt = require('bcryptjs');

/*******************
 * User Controller *
 *******************/
function UserController(core) {
  core.on('login', function(data) {
    if (checkEmptyCredentials(data.username, data.password)) {
      return "Credentials can't be empty.";
    }

    var username = data.username;

    //Find user password and compare it
    //bcrypt.compareSync(data.password, dbCryptedPassword);
  });

  core.on('signup', function(data){
    if (checkEmptyCredentials(data.username, data.password)) {
      return "Credentials can't be empty.";
    }

    var username = data.username;
    var password = bcrypt.hashSync(data.password, 10);

    //Create new User model and save
  });

  core.on('logout', function(data){});


}

UserController.prototype = {
  checkEmptyCredentials: function(username, password){
    return !username || !data.password || username === "" || data.password === "";
  }
};