(function(){
  'use strict';
  angular.module('widgetsApp')
  .controller('widgetBodyCtrl', ['$rootScope', 'Dashboards', 'Widgets', function($rootScope, Dashboards, Widgets) {
      var controller = this;

      /**
      This function is used to
      get information abour the fiven widget
      update its value representation
      update it representation in the widget_object_list and in the widget_list
      **/
      var getSelectedWidget = function(widget_id){
        Widgets.getSelected(widget_id)
        .then(function(data){
          Dashboards.setWidgetsObjectList(widget_id, data);
          $rootScope.$broadcast("update_widget_list");
        })
        .catch(function(err){
        });
      };

      controller.delete = function(widget_id, widget_name){
        Widgets.delete({element_name : 'widget', element : {id : widget_id, name : widget_name}})
        .then(function(){
          Dashboards.deleteWidgetsObjectList(widget_id);
          $rootScope.$broadcast("update_widget_list");
          Widgets.updatePositions();
        })
        .catch(function(){
        });
      };

      controller.edit = function(widget){
        Widgets.edit(widget)
        .then(function(result){
          getSelectedWidget(widget.id);
        })
        .catch(function(err){

        });
      };
    }]);
}());
