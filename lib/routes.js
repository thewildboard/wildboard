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
  server.post('/api/signup', signup);
  server.post('/api/login', login);
  server.get('/api/logout', logout);


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
      return res.json({code: 6212, message: "Please check your details and try again."});
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
        res.status(201).json({
          message: 'Welcome ' + user.local.username + "!"
        });
        return;
      }
      res.status(201).json({
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
  if(!isAuthenticated(req, res, next)) return;

  BoardController.findAllByUser(req.user, function(err, boards) {
    if (err) {
      return res.status(500).json({
        code: 4100,
        message: "There was an error. (410)"
      });
    }

    if (!boards || boards.length === 0) {
      return res.status(404).json({
        code: 4110,
        message: "You dont have any board."
      });
    }

    res.json(boards.map(function(board) {
      return board.getPublicJson();
    }));
  });
}

/**
 * Creates a new board
 */
function createBoard(req, res, next) {
  if(!isAuthenticated(req, res, next)) return;
  var json = req.body;

  BoardController.create(req.user, json, function(err, board) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json(board.getPublicJson());
  });
}

/**
 * Returns a board
 */
function board(req, res, next) {
  if(!isAuthenticated(req, res, next)) return;

  BoardController.findById(req.params.id, function(err, board) {
    if (err || !board) {
      return res.status(404).json({
        code: 413,
        message: "Couldn´t find any board with this id."
      });
    }

    res.json(board.getPublicJson());
  });
}

/**
 * Updates a board
 */
function updateBoard(req, res, next) {
  if(!isAuthenticated(req, res, next)) return;
  var json = req.body;

  BoardController.update(req.user, req.params.id, json, function(status, data) {
    res.status(status).json(data);
  });
}



//WIDGETS

/**
 * Returns all the widgets of a board
 */
function widgets(req, res, next) {
  if(!isAuthenticated(req, res, next)) return;

  WidgetController.findAllByBoard(req.params.boardId, function(err, widgets) {
    if (err) {
      return res.status(500).json({
        code: 420,
        message: "There was an error."
      });
    }

    if (!widgets || widgets.length === 0) {
      return res.status(404).json({
        code: 421,
        message: "You dont have any widget."
      });
    }

    res.json(widgets.map(function(widget) {
      return widget.getPublicJson();
    }));
  });
}

/**
 * Creates a new widget
 */
function createWidget(req, res, next) {
  if(!isAuthenticated(req, res, next)) return;

  var json = req.body;
  if (!json) return;

  WidgetController.create(req.user._id, req.params.boardId, json, function(err, widget) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json(widget.getPublicJson());
  });
}

/**
 * Returns a specific widget
 */
function widget(req, res, next) {
  if(!isAuthenticated(req, res, next)) return;

  WidgetController.findById(req.params.id, function(err, widget) {
    if (err || !widget) {
      return res.status(404).json({
        code: 413,
        message: "Couldn´t find any widget with this id."
      });
    }

    res.json(widget.getPublicJson());
  });
}

/**
 * Deletes a widget
 */
function deleteWidget(req, res, next) {
  if(!isAuthenticated(req, res, next)) return;

  if (req.user) {}

  res.json({
    message: "Not implemented yet."
  });
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
    res.status(204).json({
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
  res.status(404).json( {
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

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({
      message: "Need Authoritation"
    });
    return false;
  }
  return true;
}