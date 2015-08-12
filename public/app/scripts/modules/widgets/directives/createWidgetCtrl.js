(function(){
  'use strict';
  angular.module('widgetsApp')
  .controller('createWidgetCtrl', function ($rootScope, $scope, Widgets, Dashboards, Providers) {
    var controller = this;
    controller.showModal = false;
    controller.source_list = [];
    controller.provider_list = [];
    controller.size_type = 'small';
    $scope.source_selected = {};
    $scope.provider_selected = {};
    $scope.provider_selected.provider_selected = {};

    /**
    function used to show the CreateWidgetForm
    **/
    $scope.toggleModal = function(){
      controller.clean_widget_form();
      controller.showModal = !controller.showModal;
      if(controller.showModal){
        get_provider_list();
      }
    };

    /**
    function used to create a new widget and showed in the gridster
    **/
    controller.createWidget = function(){
      var json = {
        size_type : controller.size_type,
        name : controller.widget_name,
        color : controller.colorSelected,
        provider_name : $scope.provider_selected.provider_selected.name,
        source_selected : $scope.source_selected.source_selected.id
      };

      Widgets.create( json , Dashboards.getCurrentDashboard().id)
      .then(function(result){
        Dashboards.setWidgetsObjectList(result.id, result.data);
        Dashboards.getWidgetList();
        $rootScope.$broadcast("update_widget_list");
        $scope.toggleModal();
        Widgets.updatePositions();
        getSelectedWidget(result.id);
        controller.clean_widget_form();
      })
      .catch(function(err){
        controller.clean_widget_form();
        controller.showModal = controller.showModal;
        alert(err.message);
      });
    };


    controller.clean_widget_form = function(){
      controller.widget_name = '';
      controller.tab = 1;
      controller.colorSelected = 0;
      $scope.provider_selected.provider_selected = {};
      controller.provider_list = [];
      controller.source_list = [];
      $scope.source_selected.source_selected = {};
    };

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

    controller.source_selection_changed = function(){
      controller.has_been_the_source_selected_before = true;
      if($scope.source_selected.source_selected){
        controller.widget_name = $scope.source_selected.source_selected.description;
      }
    };

    controller.show_source_list = function(){
      controller.source_list = $scope.provider_selected.provider_selected.sources;
      controller.widget_name = '';
    };

    /** this function is used to load the porvider list in order of get the source data**/
    var get_provider_list = function(){
      Providers.get()
      .then(function(){
        controller.provider_list = Providers.getProviderList();
      })
      .catch(function(err){
      });
    };

  });
}());
