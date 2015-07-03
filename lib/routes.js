module.exports = Routes;

function Routes(core, server) {
  server.post('/signup', function(req, res) {
    var params;
    try {
      params = JSON.parse(req.body);
    } catch (Error) {
      console.log(params);
      res.json(400, "The body provided is not a valid json.");
    }
    UserController.signup(params.username, params.email, params.password, function(error, user) {
      if (error) {
        console.log(error);
        res.json(500, "There was an error.(322)");
      } else {
        res.json(201, "Signed up succesfully.");  
        /*
        passport.authenticate('local')(req, res, function() {
          res.json(201, "Signed up succesfully.");
        })*/
      }
    });
  });

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
        req.session.user_id = req.user._id;

        if (user.local.username) {
          res.json({
            success: 'Welcome ' + user.local.username + "!"
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


  /**
   * Dashboard
   **/

  server.get('/api/dashboard', function(req, res, next) {
    requireAuthenticated(req, res);

    res.json([{
      id: 0,
      name: "chickenAnalitics"
    }]);

    return next();
  });

  server.get('/api/dashboard/:id', function(req, res, next) {
    requireAuthenticated(req, res);

    res.json({
      id: 0,
      name: "chickenAnalitics",
      widgets: [{
        id: 0,
        position: 0,
        type: "ChickenMarket"
      }, {
        id: 1,
        position: 1,
        type: "Twitter_LastTweets"
      }],
    });

    return next();
  });

  server.post('/api/dashboard/:id', function(req, res, next) {
    requireAuthenticated(req, res);

    res.json({
      id: 0,
      name: "chickenAnalitics",
      widgets: [{
        id: 0,
        position: 0,
        type: "ChickenMarket"
      }, {
        id: 1,
        position: 1,
        type: "Twitter_LastTweets"
      }],
    });

    return next();
  });

  /**
   * Widgets
   **/

  server.get('/api/dashboard/:id/widgets', function(req, res, next) {
    requireAuthenticated(req, res);

    res.json([{
      id: 0,
      position: 0,
      type: "ChickenMarket"
    }, {
      id: 1,
      position: 1,
      type: "Twitter_LastTweets"
    }]);

    return next();
  });

  server.post('/api/dashboard/:id/widgets', function(req, res, next) {
    requireAuthenticated(req, res);
    //Need to get the json/body parameters

    res.json(201, "Saved.");

    return next();
  });

  server.get('/api/dashboard/:id/widgets/:widgetId', function(req, res, next) {
    requireAuthenticated(req, res);
    //Need to get the json/body parameters

    res.json({
      id: 0,
      position: 0,
      type: "ChickenMarket"
    });

    return next();
  });

  server.get("/chicken", function(req, res) {
    var body = "<h1>My name is Ralph Wiggum</h1><img src='http://orig13.deviantart.net/03f8/f/2010/156/b/f/ralph_change_poster_by_dreamwatcher7.jpg'></img>";
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
  });
}

function requireAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    res.json(401, "Need Authoritation");
    return next();
  }
}