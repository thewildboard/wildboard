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
        if (error.code == 11000) {
          return res.json(400, {
            message: "Couldn´t signup. Used username or email."
          });
        }

        if (error.code == 5343) {
          return res.json(400, {
            message: error.message
          });
        }
        res.json(500, {
          message: "There was an error.(322)"
        });
      } else if (!user) {
        res.json(400, {
          message: "Couldn´t signup."
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
          core.server.log("User logged in: " + user.local.username);
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
          code: 4100,
          message: "There was an error. (410)"
        });
      }

      if (!boards || boards.length === 0) {
        return res.json(404, {
          code: 4110,
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

    BoardController.findById(req.params.id, function(err, board) {
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


  server.patch('/api/dashboards/:id', function(req, res, next) {
    requireAuthenticated(req, res, next);
    var json = getJsonBody(req, res, next);

    BoardController.update(req.user, req.params.id, json, function(status, data) {
      res.json(status, data);
    });

    return next();
  });

  /**
   * Widgets
   **/

  server.get('/api/dashboards/:id/widgets', function(req, res, next) {
    requireAuthenticated(req, res, next);

    WidgetController.findAllByBoard(req.params.id, function(err, widgets) {
      if (err) {
        return res.json(500, {
          code: 420,
          message: "There was an error."
        });
      }

      if (!widgets || widgets.length === 0) {
        return res.json(404, {
          code: 421,
          message: "You dont have any widget."
        });
      }

      res.json(widgets.map(function(widget) {
        return widget.getPublicJson();
      }));
    });

    return next();
  });

  server.post('/api/dashboards/:id/widgets', function(req, res, next) {
    requireAuthenticated(req, res, next);
    var json = getJsonBody(req, res, next);

    WidgetController.create(req.params.id, json, function(err, widget) {
      if (err) {
        return res.json(500, err);
      }
      res.json(201, widget.getPublicJson());
    });

    return next();
  });

  server.get('/api/dashboards/:id/widgets/:widgetId', function(req, res, next) {
    requireAuthenticated(req, res, next);

    WidgetController.findById(req.params.widgetId, req.params.id, function(err, widget) {
      if (err || !widget) {
        return res.json(404, {
          code: 413,
          message: "Couldn´t find any widget with this id."
        });
      }

      res.json(widget.getPublicJson());
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

function getJsonBody(req, res, next) {
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