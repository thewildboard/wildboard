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
    } else if (!req.body || req.body === "") {
      return res.json(400, {
        message: "No data received."
      });
    } else {
      try {
        params = JSON.parse(req.body);
      } catch (Error) {
        return res.json(400, {
          message: "The body provided is not a valid json."
        });
      }
    }

    UserController.signup(params.username, params.email, params.password, function(error, user) {
      if (error) {
        console.log(error);
        if (error.code == 11000) {
          return res.json(413, {
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

    BoardController.findAllByUser(req.user, function(err, boards) {
      if (err) {
        return res.json(500, {
          code: 410,
          message: "There was an error. (410)"
        });
      }

      if (!boards || boards.length === 0) {
        return res.json(404, {
          code: 411,
          message: "You dont have any board."
        });
      }

      res.json(boards.map(function(board) {
        return board.getPublicJson();
      }));
    });

    return next();
  });

  server.post('/api/dashboards', function(req, res, next) {
    requireAuthenticated(req, res, next);
    var json = getJsonBody(req, res, next);

    BoardController.create(req.user, json, function(err, board) {
      if (err) {
        return res.json(500, err);
      }
      res.json(201, board.getPublicJson());
    });

    return next();
  });

  server.get('/api/dashboards/:id', function(req, res, next) {
    requireAuthenticated(req, res, next);

    BoardController.findById(req.params.id, function(err, board){
      if (err || !board) {
        return res.json(404, {
          code: 413,
          message: "Couldn´t find any board with this id."
        });
      }

      res.json(board.getPublicJson());
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

function getJsonBody(req, res, next){
  if (!req.body || req.body === "") {
    return res.json(400, {
      message: "No data received."
    });
  } else {
    try {
      return JSON.parse(req.body);
    } catch (Error) {
      return res.json(400, {
        message: "The body provided is not a valid json."
      });
    }
  }
}

function requireAuthenticated(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    res.json(401, {
      message: "Need Authoritation"
    });
    return next();
  }
}