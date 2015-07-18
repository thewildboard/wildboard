module.exports = Routes;

/************
 * Requires *
 ************/

//Controllers
UserController = require('./controllers/user_controller');
var BoardController = require('./controllers/board_controller');
var WidgetController = require('./controllers/widget_controller');

var core, server;

/****************
 * Routes Class *
 ****************/
function Routes(_core, _server) {
  core = _core;
  server = _server;

  /**
   * Accounts
   */
  server.post('/signup', signup);
  server.post('/login', login);
  server.get('/logout', logout);


  /**
   * Boards
   **/
  server.get('/api/boards', boards);
  server.post('/api/boards', createBoard);
  server.get('/api/boards/:id', board);
  server.patch('/api/boards/:id', updateBoard);

  /**
   * Widgets
   **/
  server.get('/api/boards/:boardId/widgets', widgets);
  server.post('/api/boards/:boardId/widgets', createWidget);
  server.get('/api/widgets/:id', widget);
  //server.delete('/api/widgets/:widgetId', t.deleteWidget);

  /**
   * Providers
   */
  server.get("/api/providers", providers);
  server.get("/api/providers/:name", provider);

  /**
   * Nothing...
   */
  server.get("/chicken", chicken);
}
//ACCOUNTS

/**
 * Local Signup
 */
function signup(req, res) {
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
}

/**
 * Local login
 */
function login(req, res, next) {
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
        return next(501, {
          code: 6533,
          message: "There was an error"
        });
      }
      req.session.user_id = req.user._id;
      if (user.local.username) {
        core.server.log("User logged in: " + user.local.username);
        res.json(201, {
          message: 'Welcome ' + user.local.username + "!"
        });
        return;
      }
      res.json(201, {
        message: 'Welcome!'
      });
    });
  })(req, res, next);
}

/**
 * Logout
 */
function logout(req, res) {
  req.logout();
}



//BOARDS

/**
 * Returns all the boards
 */
function boards(req, res, next) {
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
}

/**
 * Creates a new board
 */
function createBoard(req, res, next) {
  requireAuthenticated(req, res, next);
  var json = getJsonBody(req, res, next);

  BoardController.create(req.user, json, function(err, board) {
    if (err) {
      return res.json(500, err);
    }
    res.json(201, board.getPublicJson());
  });

  return next();
}

/**
 * Returns a board
 */
function board(req, res, next) {
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
}

/**
 * Updates a board
 */
function updateBoard(req, res, next) {
  requireAuthenticated(req, res, next);
  var json = getJsonBody(req, res, next);

  BoardController.update(req.user, req.params.id, json, function(status, data) {
    res.json(status, data);
  });

  return next();
}



//WIDGETS

/**
 * Returns all the widgets of a board
 */
function widgets(req, res, next) {
  requireAuthenticated(req, res, next);

  WidgetController.findAllByBoard(req.params.boardId, function(err, widgets) {
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
}

/**
 * Creates a new widget
 */
function createWidget(req, res, next) {
  requireAuthenticated(req, res, next);
  var json = getJsonBody(req, res, next);
  if (!json) return;

  WidgetController.create(req.user._id, req.params.boardId, json, function(err, widget) {
    if (err) {
      return res.json(500, err);
    }
    res.json(201, widget.getPublicJson());
  });

  return next();
}

/**
 * Returns a specific widget
 */
function widget(req, res, next) {
  requireAuthenticated(req, res, next);

  WidgetController.findById(req.params.id, function(err, widget) {
    if (err || !widget) {
      return res.json(404, {
        code: 413,
        message: "Couldn´t find any widget with this id."
      });
    }

    res.json(widget.getPublicJson());
  });

  return next();
}

/**
 * Deletes a widget
 */
function deleteWidget(req, res, next) {
  requireAuthenticated(req, res, next);

  if (req.user) {}

  res.json({
    message: "Not implemented yet."
  });

  return next();
}



//PROVIDERS

/**
 * Returns all the providers information
 */
function providers(req, res, next) {
  var providersArray = [];
  for (var key in core.providerManager.all()) {
    var provider = core.providerManager.find(key);
    providersArray.push({
      name: provider.name,
      url: provider.url,
      sources: provider.sources,
      auth: provider.auth
    });
  }

  if (providers.length <= 0) {
    res.json(204, {
      message: "There wasn´t any provider."
    });
    return;
  }

  res.json(providersArray);
}

/**
 * Returns a specific provider
 */
function provider(req, res, next) {
  var provider = providers.find(req.params.name);
  if (provider) {
    res.json({
      name: provider.name,
      url: provider.url,
      sources: provider.sources,
      auth: provider.auth
    });
    return;
  }
  res.json(404, {
    message: "Couldnt find a provider with that name."
  });
  return;
}



/**
 * Nothing...
 */
function chicken(req, res) {
  var body = "<h1>My name is Ralph Wiggum</h1><img src='http://orig13.deviantart.net/03f8/f/2010/156/b/f/ralph_change_poster_by_dreamwatcher7.jpg'></img>";
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/html'
  });
  res.write(body);
  res.end();
}

function getJsonBody(req, res, next) {
  if (!req.body || req.body === "") {
    res.json(400, {
      message: "No data received."
    });
    return;
  } else {
    try {
      return JSON.parse(req.body);
    } catch (Error) {
      res.json(400, {
        message: "The body provided is not a valid json."
      });
      return;
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