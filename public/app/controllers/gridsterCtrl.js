'use strict';
angular.module('dashboardApp')
  .controller('gridsterCtrl', function($rootScope, $scope, Providers, Widgets) {
    var controller = this;
    controller.source_list = [];
    $scope.source_selected = null;
    $scope.showModal = false;
    controller.size_type = 'small';
    /**
    This funcion is used to list all the sources and the providers this osources belong
    */

    $scope.toggleModal = function(){
      controller.widget_name = '';
      $scope.showModal = !$scope.showModal;
    };

    $scope.createWidget = function(){
      var size_type = controller.size_type === 'small' ? 1 : controller.size_type === 'medium' ? 2 : 3;
      var data = {
        name : controller.widget_name,
        position : {
          col: 0,
          row: 0,
          width: 2 * size_type,
          height: 1 * size_type
        },
        indicator : {
          source : {
            provider : {
              name : controller.source_selected.provider
            },
            id : controller.source_selected.id
          }
        }
      };




      Widgets.create(data, $scope.dashboard.dashboardSelected.id)
      .then(function(result){
        var data = {
          sizeX : result.data.position.width,
          sizeY : result.data.position.height,
          col : result.data.position.col,
          row : result.data.position.row,
          data : result.data,
          template : '<first-widget></first-widget>'
        };
        $scope.dashboard.widget_list.push(data);
        $scope.toggleModal();
        controller.widget_name = '';

        controller.updatePluginsPosition();

      })
      .catch(function(err){

      });

    };

    var does_not_have_same_position = function(current){
      var json = current.data;
      return json.position.col !== current.col ||
         json.position.row !== current.row ||
         json.position.width !== current.sizeX||
         json.position.height !== current.sizeY;
    }

    controller.updatePluginsPosition = function(){
      var i = 0;
      var elements = $scope.dashboard.widget_list;
      var length = elements.length;
      var current;
      var json;
      for (i; i < length; i += 1){
        current = elements[i];
        json = current.data;
        if(does_not_have_same_position(current)){
          json.position.col = current.col;
          json.position.row = current.row;
          json.position.width = current.sizeX;
          json.position.height = current.sizeY;
          //Widgets.update(json, $scope.dashboard.dashboardSelected);
        }
      }
    };

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
        controller.source_selected = controller.source_list[0]
      })
      .error(function(err){
      });
    }



    controller.gridsterOpts = {
      columns: 6, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: true, // whether or not to have items switch places instead of push down if they are the same size
      width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
      colWidth: 250, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 100, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [10, 10], // the pixel distance between each widget
      outerMargin: true,
      mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      isMobile: false, // stacks the grid items if true
      mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      minColumns: 1, // the minimum columns the grid must have
      minRows: 2, // the minimum height of the grid, in rows
      maxRows: 100,
      defaultSizeX: 2, // the default width of a gridster item, if not specifed
      defaultSizeY: 1, // the default height of a gridster item, if not specified
      resizable: {
         enabled: false,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         start: function(event, $element, widget) {}, // optional callback fired when resize is started,
         resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
         stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
      },
      draggable: {
         enabled: true, // whether dragging items is supported
  			//handle: '.my-class', // optional selector for resize handle
         start: function (event, $element, widget) { }, // optional callback fired when drag is started,
         drag: function (event, $element, widget) { }, // optional callback fired when item is moved,
         stop: function (event, $element, widget) {
           controller.updatePluginsPosition();
           // en esta parte solo me muestra el actual cambiado, posiciones, pero tengo que cambiar otra cosa
         } // optional callback fired when item is finished dragging
      }
    };


    controller.provider_list();
});
