'use strict';
angular.module('dashboardApp')
  .controller('gridsterCtrl', function($rootScope, $scope, Providers) {
    var controller = this;
    controller.source_list = [];
    $scope.source_selected = null;
    /**
    This funcion is used to list all the sources and the providers this osources belong
    */
    controller.provider_list = function(){
      Providers.get()
      .success(function(data){
        var i = 0;
        var length = data.length;
        var sources;
        var provider_list = [];
        var provider;
        var source;
        var current_source;
        controller.source_list = [];
        for (i; i < length; i+=1) {
          provider = data[i];
          sources = provider.sources;
          for(source in sources){
            current_source = sources[source];
            current_source.provider = provider.name;
            controller.source_list.push(current_source);
          }
        }
      })
      .error(function(err){
      });
    }


    $scope.standardItems = [
      // { sizeX: 2, sizeY: 2, row: 0, col: 0, template: "<first-widget></first-widget>" },
      // { sizeX: 2, sizeY: 2, row: 0, col: 2, template: "<first-widget></first-widget>" },
    ];

    $scope.addWidget = function(type) {
      var newWidget = { sizeX: 2, sizeY: 2, row: 0, col: 0, template: "<" + type + "-widget></" + type + "-widget>" };
      $scope.standardItems.push(newWidget);
      //checkPositions();
    };

    $scope.deleteWidget = function($index) {
      $scope.standardItems.splice($index, 1);
    };

    controller.gridsterOpts = {
      columns: 8, // the width of the grid, in columns
      swapping: true, // whether or not to have items switch places instead of push down if they are the same size
      width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
      margins: [4, 4], // the pixel distance between each widget
      outerMargin: false,
      mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      resizable: {
         enabled: false,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         start: function(event, $element, widget) {}, // optional callback fired when resize is started,
         resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
         stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
      }
    };
    controller.provider_list();
});
