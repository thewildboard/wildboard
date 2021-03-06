/************
 * Requires *
 ************/
var async = require('async');
var Log = require("./log");

//Controllers
var UserController;
var BoardController;
var WidgetController;

var core, server;

/****************
 * Routes Class *
 ****************/
function Routes(_core, _server) {
  core = _core;
  server = _server;

  //Load Controllers
  UserController = require('./controllers/user_controller')(Routes);
  BoardController = require('./controllers/board_controller')(Routes);
  WidgetController = require('./controllers/widget_controller')(Routes);


  server.get('/login', function(req, res){
    res.redirect('/');
  });

  server.get('/user/logged', function(req, res){
    res.send(req.isAuthenticated() && req.user != null);
  });
  server.post('/user/signup', signup);
  server.post('/user/login', login);
  server.get('/user/logout', requireAuth, logout);
  server.get('/user/auth', passport.authenticate('oauth2'));

  server.get('/user/auth/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), function(req, res) {
    //Log.log("Oauth2 user logged.");
    res.redirect('/');
  });

  /*******
   * API *
   *******/

  /**
   * Accounts
   */
  server.get('/api/logout', function(req, res){ res.redirect('/user/logout'); });

  /**
   * Boards
   */
  server.get('/api/boards', requireAuth, boards);
  server.post('/api/boards', requireAuth, createBoard);
  server.get('/api/boards/:id', requireAuth, board);
  server.patch('/api/boards/:id', requireAuth, updateBoard);
  server.delete('/api/boards/:id', requireAuth, deleteBoard);

  /**
   * Widgets
   */
  server.get('/api/boards/:id/widgets', requireAuth, widgets);
  server.post('/api/boards/:id/widgets', requireAuth, createWidget);
  server.get('/api/widgets/:id', requireAuth, widget);
  server.patch('/api/widgets/:id', requireAuth, updateWidget);
  server.delete('/api/widgets/:id', requireAuth, deleteWidget);

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
    return res.status(400).json({
      message: "No data received."
    });
  } else {
    try {
      params = JSON.parse(req.body);
    } catch (Error) {
      return res.status(400).json({
        message: "The body provided is not a valid json."
      });
    }
  }

  UserController.signup(params.username, params.email, params.password, function(error, user) {
    if (error) {
      if (error.code == 11000) {
        return res.status(400).json({
          message: "Couldn´t signup. Used username or email."
        });
      }

      if (error.code == 5343) {
        return res.status(400).json({
          message: error.message
        });
      }
      res.json(500, {
        message: "There was an error.(322)"
      });
    } else if (!user) {
      res.status(400).json({
        message: "Couldn´t signup."
      });
    } else {
      Log.log("New user: " + params.username);
      res.status(201).json({
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
      return res.status(401).json({
        code: 6212,
        message: "Please check your details and try again."
      });
    }

    // Log the user in!
    req.logIn(user, function(err) {
      if (err) {
        res.status(400).json({
          code: 6533,
          message: "There was an error"
        });
        return;
      }
      req.session.user_id = user._id;
      if (user.local.username) {
        core.server.log("User logged in: " + user.local.username);
        res.status(200).json({
          message: 'Welcome ' + user.local.username + "!"
        });
        return;
      }
      res.status(200).json({
        message: 'Welcome!'
      });
    });
  })(req, res, next);
}

/**
 * Logout
 */
function logout(req, res) {
  if(req.user.local && req.user.local.username)
    Log.log(req.user.local.username + " logged out.");
  else
    Log.log("User logged out.");

  req.logout();
  res.json({
    message: "Logged out."
  });
}



//BOARDS

/**
 * Returns all the boards
 */
function boards(req, res, next) {
  BoardController.findAllByUser(req.user, function(err, boards) {
    if (err) {
      return res.status(500).json({
        code: 4100,
        message: "There was an error. (410)"
      });
    }

    if (!boards || boards.length === 0) {
      return res.json([]);
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
  BoardController.create(req.user, req.body, function(err, board) {
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
  var json = req.body;

  BoardController.update(req.params.id, json, function(status, data) {
    res.status(status).json(data);
  });
}

/**
 * Removes a board
 */
function deleteBoard(req, res, next) {
  var json = req.body;

  BoardController.remove(req.user, req.params.id, function(err) {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.json({
      message: "Removed succesfully"
    });
  });
}



//WIDGETS

/**
 * Returns all the widgets of a board
 */
function widgets(req, res, next) {
  WidgetController.findByBoard(req.params.id, function(widgets) {
    if (!widgets || widgets.length === 0) {
      return res.json([]);
    }
    async.map(widgets, function(widget, fn) {
      WidgetController.getPublicJson(core, widget, fn);
    }, function(e, result) {
      res.json(result);
    });
  });
}

/**
 * Creates a new widget
 */
function createWidget(req, res, next) {
  var json = req.body;
  if (!json) {
    res.status(400).json({
      message: "The body provided is empty or is not a valid json."
    });
  }
  if (json.indicator) {
    var source = json.indicator.source;
    if (!core.providerManager.findSource(source.provider.name, source.id)) {
      res.status(400).json({
        message: "Invalid datasource."
      });
      return;
    }
  }

  WidgetController.create(req.user._id, req.params.id, json, function(err, widget) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json({
      widgetId: widget._id,
      message: "Created"
    });
  });
}

/**
 * Returns a specific widget
 */
function widget(req, res, next) {
  WidgetController.findById(req.params.id, function(widget) {
    if (!widget) {
      return res.status(404).json({
        code: 413,
        message: "Couldn´t find any widget with this id."
      });
    }
    WidgetController.getPublicJson(core, widget, function(err, publicJson) {
      res.json(publicJson);
    });
  });
}

/**
 * Updates a widget
 */
function updateWidget(req, res, next) {
  var json = req.body;

  WidgetController.update(req.params.id, json, function(status, data) {
    res.status(status).json(data);
  });
}

/**
 * Deletes a widget
 */
function deleteWidget(req, res, next) {
  WidgetController.remove(req.params.id, function(err) {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.json({
      message: "Removed succesfully"
    });
  });
}



//PROVIDERS

/**
 * Returns all the providers information
 */
function providers(req, res, next) {
  var providersArray = [];
  var providers = core.providerManager.all();
  for (var key in providers) {
    var provider = providers[key];
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
  res.status(404).json({
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


//Middlewares
function requireAuth(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({
      message: "Need Authoritation"
    });
    return;
  }
  next();
}


Routes.db = {};
Routes.model = function(name) {
  if (!Routes.db[name]) {
    Routes.db[name] = require("./models/" + name);
  }
  return Routes.db[name];
}

function useModel(name) {
  return useModels([name]);
}

function useModels(names) {
  if (!(names instanceof Array)) {
    if (typeof names != "string") {
      return;
    }
    names = [names];
  }

  return function(req, res, next) {
    req.db = {};
    for (var i = 0, len = names.length; i < len; i++) {
      var name = names[i];
      if (typeof name == "string") {
        req.db[name] = Routes.model(name);
      }
    }
    next();
  }
}

module.exports = Routes;
