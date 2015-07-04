module.exports = Routes;

/************
 * Requires *
 ************/

//Controllers
UserController = require('./controllers/user_controller');
var BoardController = require('./controllers/board_controller');
var WidgetController = require('./controllers/widget_controller');


/****************
 * Routes Class *
 ****************/
function Routes(core, server) {
  server.post('/signup', function(req, res) {
    var params;
    if (typeof req.body == "object") {
      params = req.body;
    } else {
      try {
        params = JSON.parse(req.body);
      } catch (Error) {
        return res.json(400, {message: "The body provided is not a valid json."});
      }
    }
    UserController.signup(params.username, params.email, params.password, function(error, user) {
      if (error) {
        console.log(error);
        if (error.code == 11000) {
          return res.json(500, {
            message: "Couldn´t signup. Used username or email."
          });
        }
        res.json(500, {
          message: "There was an error.(322)"
        });
      } else {
        core.server.log("New user: " + params.username);
        res.json(201, {
          message: "Signed up succesfully."
        });
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
        self.log();
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

  server.get('/api/dashboards', function(req, res, next) {
    requireAuthenticated(req, res, next);

    res.json({
      message: "Not implemented yet.",
      data: [{
        id: 0,
        name: "chickenAnalitics"
      }]
    });

    return next();
  });

  server.post('/api/dashboards', function(req, res, next) {
    requireAuthenticated(req, res, next);
    var json;
    try {
        json = JSON.parse(req.body);
      } catch (Error) {
        return res.json(400, {message: "The body provided is not a valid json."});
    }

    BoardController.create(req.user, json, function(err, board){
      res.json((err)? 400: 201, err || board);
    });

    res.json(201, {

    });

    return next();
  });

  server.get('/api/dashboards/:id', function(req, res, next) {
    requireAuthenticated(req, res, next);

    res.json({
      message: "Not implemented yet.",
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

  server.get('/api/dashboards/:id/widgets', function(req, res, next) {
    requireAuthenticated(req, res, next);

    res.json({
      message: "Not implemented yet.",
      data: [{
        id: 0,
        position: 0,
        type: "ChickenMarket"
      }, {
        id: 1,
        position: 1,
        type: "Twitter_LastTweets"
      }]
    });

    return next();
  });

  server.post('/api/dashboards/:id/widgets', function(req, res, next) {
    requireAuthenticated(req, res, next);

    res.json(201, {
      message: "Not implemented yet."
    });

    return next();
  });

  server.get('/api/dashboards/:id/widgets/:widgetId', function(req, res, next) {
    requireAuthenticated(req, res, next);

    res.json({
      message: "Not implemented yet.",
      id: 0,
      position: 0,
      type: "ChickenMarket"
    });

    return next();
  });

  /*server.delete('/api/dashboards/:id/widgets/:widgetId', function(req, res, next) {
    requireAuthenticated(req, res, next);

    if (req.user) {}

    res.json({
      message: "Not implemented yet."
    });

    return next();
  });*/

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
  if (!req.isAuthenticated() || !req.user) {
    res.json(401, {
      message: "Need Authoritation"
    });
    return next();
  }
}