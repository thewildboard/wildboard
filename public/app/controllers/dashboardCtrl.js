'use strict';
angular.module('dashboardApp')
.controller('dashboardCtrl', function ($scope, $http, DashboardActions, Widgets) {
  var controller = this;
  $scope.showModal = false;
  controller.confirm_delete_dashboard = 'Do you wan to delete the dashboard "$1"?'


  controller.deleteDashboard = function() {
    DashboardActions.delete(controller.dashboardSelected.id)
    .then(function(response){
      controller.dashboard_list();
    })
    .catch(function(err){
    });
  };

  var clean_dashboard_values = function(){
    controller.dashboard_selected = null;
    controller.dashboardList = [];
    controller.widget_list = [];
    controller.widget_object_list = {};
    controller.dashboardSelected = {};
    $scope.item = {};
  };


  /**
  This function is used to decide if show the create_dashboard form
  **/
  $scope.toggleModal = function(){
    controller.name = '';
    $scope.showModal = !$scope.showModal;

  };

  /**
  Here we list all dashboard that the user have created
  and if there is some then we automatically we select the first one
  **/
  controller.dashboard_list = function(){
    clean_dashboard_values();
    DashboardActions.dashboardList()
    .then(function(result){
      controller.dashboardList = result.data;
      if ( result.data.length >= 1 ) {
        $scope.item = result.data[0];
        controller.no_dashboard = false;
        controller.showDashboard();
      }
      else{
        controller.no_dashboard = true;
      }

    })
    .catch(function(error){
      controller.no_dashboard = true;
    });
  };

  /**
  this function is used to load all the widget of a specific dashboard and create the structure needed to the
  correct visualization
  **/
  controller.load_and_show_widgets = function(dashboard_id){
    Widgets.get(dashboard_id)
    .success(function(result){
      var i = 0;
      var current_list = result;
      var current;
      for(i; i < current_list.length; i += 1){
        current = current_list[i];
        controller.widget_object_list[current.id] = {
          sizeX : current.position.width,
          sizeY : current.position.height,
          col : current.position.col,
          row : current.position.row,
          template : '<first-widget></first-widget>',
          data : current
        };
      }
      controller.widget_list = controller.getCollection(controller.widget_object_list);
    });
  };


  /**
  This function is used to show the widgets that an specific dashbaord have
  **/
  controller.showDashboard = function(){
    controller.dashboard_selected = true;
    controller.dashboardSelected = $scope.item;
    controller.widget_list = [];
    controller.widget_object_list = {};
    controller.load_and_show_widgets(controller.dashboardSelected.id);
  };

  /**
  aux_function used to get all the values of an object
  **/
  controller.getCollection = function(obj){
    var i;
    var result = [];
    for (i in obj){
      result.push(obj[i]);
    }
    return result;
  };

  /**
  This function is used to create a new dashbaord.
  **/
  controller.createDashboard = function(){
    DashboardActions.dashboardCreate({
      name : controller.name,
      owner : 'me'
    })
    .success(function(data){
      controller.no_dashboard = false;
      $scope.showModal = false;
      controller.name = '';
      controller.dashboardList.push(data);
      setTimeout(function () {changeValue(data)}, 0);
    })
    .error(function(result){
      $scope.showModal = false;
      controller.name = '';
      alert(result.message);
    });
  };

  var changeValue = function(data){
    controller.dashboardSelected = data;
    $scope.item = data;
    controller.showDashboard();
  };

});
