module.exports = Routes;

function Routes(core, server) {
  server.get('/api/dashboard', function(req, res) {
    requireAuthenticated(req, res);

    res.send("Welcome to your dashboard, " + req.user.username);

    return next();
  });

  server.post('/signup', function(req, res) {});

  server.post('/login', function(req, res, next) {
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

  server.get('/logout', function(req, res) {
    req.logout();
  });
}

function requireAuthenticated(req, res) {
  if (!req.isAuthenticated()) {
    res.send("Need Authoritation", 401)
    return next();
  }
}