/************
 * Requires *
 ************/
var IndicatorController;

var Routes;

function model(name){
  return Routes.model(name);
}

/****************************
 * Widget Controller Handlers *
 ****************************/
var WidgetController = function(_Routes){
  if (!(this instanceof WidgetController)) {
    return new WidgetController(_Routes);
  }

  //Late Asignations
  Routes = _Routes;
  IndicatorController = require("./indicator_controller")(_Routes);
}

WidgetController.prototype = {
  create: function(userId, id, data, fn) {
    var self = this;

    model("widget").create({
      name: data.name,
      board: id,
      position: data.position,
      style: data.style
    }, function(err, widget) {
      if (err) {
        return fn({
          code: 460,
          message: "There was an error."
        }, null);
      }
      if (!widget) {
        return fn({
          code: 461,
          message: "Couldn´t create the widget."
        }, null);
      }

      if (data.indicator) {
        createAndAssignIndicator(userId, widget, data.indicator, fn);
        return;
      }
      return fn(null, widget);
    });
  },

  update: function(id, data, fn) {
    var update = {};
    if (data.name) update.name = data.name;
    if (data.position) update.position = data.position;
    if (data.style) update.style = data.style;

    model("widget").update({
      _id: id
    }, update, function(err, numAffected) {
      if (err) {
        fn(404, {
          code: 3543,
          message: "Couldn´t update the board.",
        });
      } else if (numAffected == 0) {
        fn(404, {
          code: 3544,
          message: "Couldn´t update the board.",
        });
      } else {
        fn(200, {
          message: "Updated Widget"
        });
      }
    });
  },

  remove: function(id, fn) {
    model("widget").remove({
      _id: id
    }, fn);
  },

  removeByBoard: function(id, fn) {
    model("widget").remove({
      board: id
    }, fn);
  },

  findByBoard: function(boardId, fn) {
    model("widget").find({
      board: boardId
    }, function(err, widgets) {
      if (err) console.log(err);
      fn(widgets);
    });
  },

  findById: function(id, fn) {
    model("widget").findOne({
      _id: id
    }, function(err, widget) {
      if (err) console.log(err);
      fn(widget);
    });
  },

  getPublicJson: function(core, widget, fn) {
    var publicJson = widget.getPublicJson();
    if (widget.indicator) {
      IndicatorController.findById(widget.indicator, function(indicator) {
        var source = core.providerManager.findSource(indicator.provider, indicator.source);

        IndicatorController.getValues(widget.indicator, source, function(values) {
          publicJson.indicator = {
            source: {
              provider: {
                name: indicator.provider,
                token: ""
              },
              id: indicator.source,
              unit: source? (source.unit || "") : "units"
            },
            values: values
          };
          fn(null, publicJson);
        });
      });
    } else {
      fn(null, publicJson);
    }
  }
};
module.exports = WidgetController;

function createAndAssignIndicator(userId, widget, data, fn) {
  IndicatorController.updateOrCreate(userId, data, function(indicator) {
    if (!indicator) {
      fn({
        code: 9325,
        message: "Couldn´t create the indicator."
      });
    }
    widget.indicator = indicator._id;
    widget.save(function(err) {
      if (err) {
        throw new Error("Couldnt save the widget.");
      }
      fn(null, widget);
    });
  });
};