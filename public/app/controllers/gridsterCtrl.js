'use strict';
angular.module('dashboardApp')
  .controller('gridsterCtrl', function($rootScope, $scope, Providers, Widgets, $modal, $log) {
    var controller = this;

    controller.source_list = [];
    controller.provider_list = [];
    $scope.source_selected = {};
    $scope.provider_selected = {};
    $scope.provider_selected.provider_selected = {};
    $scope.showModal = false;
    controller.size_type = 'small';


    controller.source_selection_changed = function(){
        controller.has_been_the_source_selected_before = true;
        controller.widget_name = $scope.source_selected.source_selected.description;
    };
    /**
    This funcion is used to list all the sources and the providers this osources belong
    */

    var clean_widget_form = function(){
      controller.tab = 1;
      controller.image_selected = 1;
      controller.widget_name = '';
      controller.unit_measure = '';
      $scope.provider_selected.provider_selected = {};
      $scope.source_selected = {};
    };

    /**
    function used to show the CreateWidgetForm
    **/
    $scope.toggleModal = function(){
      clean_widget_form();
      $scope.showModal = !$scope.showModal;
      if($scope.showModal){
        controller.get_provider_list();
      }
    };

    controller.jumpToInvalidTab = function(){
      controller.tab = 1;
      /*if(controller.data_form.$valid){
        controller.tab = 2;
      }*/
    };

   /**
   This function is used to
        get information abour the fiven widget
        update its value representation
        update it representation in the widget_object_list and in the widget_list
   **/
    controller.getSelectedWidget = function(widget_id){
      Widgets.getSelected(widget_id)
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
      })
      .catch(function(err){
      });
    };

    /** This function is used to create a newWidget
        position  ==> will be the first of all widgets
    **/
    controller.createWidget = function(){
      var width_size = controller.size_type === 'small' ? 1 : controller.size_type === 'medium' ? 1 : 2;
      var height_size = controller.size_type === 'small' ? 1 : controller.size_type === 'medium' ? 2 : 2;
      var data = {
        name : controller.widget_name,
        unit_of_measure : controller.unit_measure,
        position : {
          col: 0,
          row: 0,
          width: width_size,
          height: height_size
        },
        indicator : {
          source : {
            provider : {
              name : $scope.provider_selected.provider_selected.name
            },
            id : $scope.source_selected.source_selected.id
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

        controller.updatePluginsPosition();
        controller.getSelectedWidget(result.data.widgetId);
      })
      .catch(function(err){
        controller.widget_name = '';
        $scope.showModal = !$scope.showModal;
        alert(err.message);
      });
    };

    //Auxiliar function used to know is the current widgets have position changed

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

    /**
    This function update the widgets if there hacve changed its position
    **/
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
          json = {};
          json.name = current.data.name;
          json.unit_of_measure = current.data.unit_of_measure;
          json.position = current.data.position;
          json.position.col = current.col;
          json.position.row = current.row;
          json.position.width = current.sizeX;
          json.position.height = current.sizeY;

          Widgets.update( {data : json , widget_id : current.data.id} )
          .then(function(){
          })
          .catch(function(){
          });
        }
      }
    };

    /** action used to delete the selected widget**/
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

    controller.widget_delete_action = function(widget_id, widget_name){
      var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'app/views/directives/confirm_delete.html',
          controller: 'ModalInstanceCtrl',
          size: 'md',
          resolve: {
            items: function () {
              return {
                element : 'widget',
                name : widget_name
              };
            }
          }
        });
        modalInstance.result.then(function (selectedItem) {
          controller.widget_delete(widget_id);
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };


    controller.editWidgetPress = function(widget){
      controller.widget_edit_name = widget.name;
      controller.unit_edit_measure = widget.pp;
      var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'app/views/directives/editWidget.html',
          controller: 'editWidgetCtrl',
          size: 'md',
          resolve: {
            items: function () {
              return {
                data : widget,
                gridster : controller
              };
            }
          }
        });
        modalInstance.result.then(function (selectedItem) {
          controller.widget_edit(widget.id);
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });


    };

    controller.widget_edit = function(widget_id){
      var json = {
        name : controller.widget_edit_name,
        unit_of_measure : controller.edit_widget_measure,
      };
      Widgets.update({widget_id : widget_id, data :json})
      .then(function(result){
        controller.getSelectedWidget(widget_id);

      })
      .catch(function(err){

      });
    };


    var clean_edit_form = function(){
      controller.edit_widget_name = '';
      controller.edit_widget_measure = '';
    };


    /** this function is used to load the porvider list in order of get the source data**/
    controller.get_provider_list = function(){
      Providers.get()
      .then(function(result){
        var i = 0;
        var data = result.data;
        var length = data.length;
        var sources;
        var provider;
        var source;
        var provider_source_list = [];
        controller.provider_list = [];
        for (i; i < length; i+=1) {
          provider = {
            name : data[i].name,
            sources : provider_source_list
          };
          controller.provider_list.push(provider);
          sources = data[i].sources;
          for(source in sources){
            provider_source_list.push(sources[source]);
          }
        }
      })
      .catch(function(err){

      });
    };

    controller.show_source_list = function(){
      controller.source_list = $scope.provider_selected.provider_selected.sources;
    };

    controller.gridsterOpts = {
      columns: 8, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: true, // whether or not to have items switch places instead of push down if they are the same size
      width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
      colWidth: 350, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 225, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [15, 15], // the pixel distance between each widget
      outerMargin: true,
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      isMobile: true, // stacks the grid items if true
      mobileBreakPoint: 500, // if the screen is not wider that this, remove the grid layout and stack the items

      minColumns: 1, // the minimum columns the grid must have
      minRows: 1, // the minimum height of the grid, in rows
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
