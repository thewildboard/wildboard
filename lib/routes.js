module.exports = Routes;

function Routes(core, server) {
  server.get('/api/dashboard', function(req, res) {
    console.log(req.isAuthenticated());
    if (req.user) {
      res.send("Welcome to your dashboard, " + req.user.username);
    } else {
      res.send("Hey! Appreciated unauthenticated user, go away.");
    }

    return next();
  });

  server.post('/user/signup', function(req, res) {});

  server.post('/user/login', function(req, res, next) {
    // The local login strategy
    passport.authenticate('local', function(err, user) {
      if (err) {
        return next(err);
      }

      // Technically, the user should exist at this point, but if not, check
      if (!user) {
        return next(new restify.InvalidCredentialsError("Please check your details and try again."));
      }

      // Log the user in!
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        console.log(req.isAuthenticated());
        req.session.user_id = req.user.id;

        if (user.username) {
          res.json({
            success: 'Welcome ' + user.username + "!"
          });
          return next();
        }

        res.json({
          success: 'Welcome!'
        });
        return next();
      });

    })(req, res, next);
  });

}