(function(){
  'use strict';

  angular.module('widgetsApp')
  .factory('Widgets', ['$modal', '$log', 'WidgetsApi', 'Dashboards', function WidgetsFactory($modal, $log, WidgetsApi, Dashboards){
    /**
    @param{object} result ====> the json eelments that defined the widget
    this function is used to create the data structure of the widget retrieved
    */
    var buildWidget = function(result){
      var data = {
        sizeX : result.data.position.width,
        sizeY : result.data.position.height,
        col : result.data.position.col,
        row : result.data.position.row,
        data : result.data,
        template : '<number-template></number-template>'
      };
      return data;
    };

    /**
    @param{string} widget_id ===> id of the widget we want to call
    **/
    var getSelected = function(widget_id){
      return WidgetsApi.get(widget_id)
      .then(buildWidget);
    };

    /*************************/

    /**
    @param{object} result ==> this object contain the widget_id
    @param{object} data
    ***/
    var buildEmptyWidget = function(result, data){
      return {
        data : {
          sizeX : data.position.width,
          sizeY : data.position.height,
          col : data.position.col,
          row : data.position.row,
          data : {},
          template : '<loading-value></loading-value>'
        },
        id : result.data.widgetId
      };
    };

    /** This function is used to create a newWidget
    position  ==> will be the first of all widgets
    **/

    var chooseColor = function(color){
      switch(color) {
        case 0:
        return "#328FB0";
        case 1:
        return "#E91E63";
        case 2:
        return "#FF5722";
        case 3:
        return "#4CAF50";
        default:
        return "#328FB0";
      }
    };

    var getSizeType = function(size_type){
      var width_size = size_type === 'small' ? 1 : size_type === 'medium' ? 1 : 2;
      var height_size = size_type === 'small' ? 1 : size_type === 'medium' ? 2 : 2;
      return {
        width : width_size,
        height : height_size
      };
    };

    var create = function(json, dashboard_id){
      var size = getSizeType(json.size_type);
      var data = {
        name : json.name,
        position : {
          col: 0,
          row: 0,
          width: size.width,
          height: size.height
        },
        style : {
          color : chooseColor(json.color)
        },
        indicator : {
          source : {
            provider : {
              name : json.provider_name
            },
            id : json.source_selected
          }
        }
      };
      return WidgetsApi.post({data : data, dashboard_id : dashboard_id})
      .then(function(result){
        return buildEmptyWidget(result, data);
      });
    };



    //Auxiliar function used to know is the current widgets have position changed

    var doesNotHaveSameposition = function(current){
      var json = current.data;
      if(!json.position){
        return false;
      }
      return json.position.col !== current.col ||
      json.position.row !== current.row ||
      json.position.width !== current.sizeX||
      json.position.height !== current.sizeY;
    };

    var updatePosition = function(widget){
      var json = {};
      json.name = widget.data.name;
      json.position = widget.data.position;
      json.position.col = widget.col;
      json.position.row = widget.row;
      json.position.width = widget.sizeX;
      json.position.height = widget.sizeY;

      return {
        data : json,
        widget_id : widget.data.id
      };
    };

    /**
    This function update the widgets if there hacve changed its position
    **/

    var updatePositions = function(){
      var i = 0;
      var widgets = Dashboards.getWidgetList();
      var current;
      var json;
      var current_id;
      for (i; i < widgets.length; i += 1){
        current = widgets[i];
        if(doesNotHaveSameposition(current)){
          WidgetsApi.update(updatePosition(current));
        }
      }
    };

    var delete_ = function(data){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/scripts/directives/confirmDelete.html',
        controller: 'ConfirmDeleteCtrl',
        size: 'md',
        resolve: {
          items: function () {
            return {
              element : data.element_name,
              name : data.element.name
            };
          }
        }
      });
      return modalInstance.result.then(function (selectedItem) {
        WidgetsApi.delete(data.element.id);
      });
    };


    var edit = function(widget){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/scripts/modules/widgets/directives/editWidget.html',
        controller: 'editWidgetCtrl',
        size: 'md',
        resolve: {
          items: function () {
            return {
              name : widget.name
            };
          }
        }
      });
      return modalInstance.result.then(function (selectedItem) {
        WidgetsApi.update({widget_id : widget.id, data : {name : selectedItem}});
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    return {
      getSelected : getSelected,
      create : create,
      updatePositions : updatePositions,
      delete : delete_,
      edit : edit
    };
  }]);
}());
