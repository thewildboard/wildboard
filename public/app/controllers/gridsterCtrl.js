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
      controller.provider_list();
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

      Widgets.create({ data : data, dashboard_id : $scope.dashboard.dashboardSelected.id })
      .then(function(result){
        var data_value = {
          sizeX : data.position.width,
          sizeY : data.position.height,
          col : data.position.col,
          row : data.position.row,
          data : {},
          template : '<loading-value></loading-value>'
        };
        $scope.dashboard.widget_object_list[result.data.widgetId] = data_value;
        $scope.dashboard.widget_list = $scope.dashboard.getCollection($scope.dashboard.widget_object_list);

        $scope.toggleModal();
        controller.widget_name = '';

        controller.updatePluginsPosition();

        Widgets.getSelected(result.data.widgetId)
        .then(function(result){
          var data = {
            sizeX : result.data.position.width,
            sizeY : result.data.position.height,
            col : result.data.position.col,
            row : result.data.position.row,
            data : result.data,
            template : '<first-widget></first-widget>'
          };
          $scope.dashboard.widget_object_list[result.data.id] = data;
          $scope.dashboard.widget_list = $scope.dashboard.getCollection($scope.dashboard.widget_object_list);
        });
      })
      .catch(function(err){

      });

    };

    var does_not_have_same_position = function(current){
      var json = current.data;
      if(!json.position){
        return false;
      }
      return json.position.col !== current.col ||
         json.position.row !== current.row ||
         json.position.width !== current.sizeX||
         json.position.height !== current.sizeY;
    }

    controller.updatePluginsPosition = function(){
      var i = 0;
      var elements = $scope.dashboard.widget_object_list;
      var current;
      var json;
      var current_id;

      for (i in elements){
        current = elements[i];
        json = {};
        if(does_not_have_same_position(current)){
          json.data = {};
          json.data.name = current.data.name;
          json.data.position = current.data.position;
          json.data.position.col = current.col;
          json.data.position.row = current.row;
          json.data.position.width = current.sizeX;
          json.data.position.height = current.sizeY;
          Widgets.update( {data : json , widget_id : current.data.id} )
          .then(function(){

          })
          .catch(function(){
          });
        }
      }

    };

    controller.widget_delete = function(widget_id){
      Widgets.delete(widget_id)
      .then(function(result){
        delete $scope.dashboard.widget_object_list[widget_id];
        $scope.dashboard.widget_list = $scope.dashboard.getCollection($scope.dashboard.widget_object_list);
        controller.updatePluginsPosition();
      })
      .catch(function(err){

      });
    };

    controller.provider_list = function(){
      Providers.get()
      .then(function(result){
        var i = 0;
        var data = result.data;
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
      .catch(function(err){

      });
    }



    controller.gridsterOpts = {
      columns: 8, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: true, // whether or not to have items switch places instead of push down if they are the same size
      width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
      colWidth: 350, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 175, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [15, 15], // the pixel distance between each widget
      outerMargin: true,
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      isMobile: false, // stacks the grid items if true
      mobileBreakPoint: 500, // if the screen is not wider that this, remove the grid layout and stack the items

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
});
