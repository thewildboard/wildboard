'use strict';
angular.module('dashboardApp')
.controller('dashboardCtrl', function ($scope, $http, DashboardActions, Widgets) {
  var controller = this;
  controller.dashboard_selected = null;
  controller.dashboardList = [];
  controller.widget_list = [];
  controller.dashboardSelected = null;
  $scope.showModal = false;

  var init = function(){
    controller.dashboard_list();
  };

  $scope.toggleModal = function(){
    controller.name = '';
    $scope.showModal = !$scope.showModal;

  };

  controller.dashboard_list = function(){
    DashboardActions.dashboardList()
    .then(function(result){
      controller.dashboardList = result.data;
      controller.no_dashboard = controller.dashboardList.length <=0 ? true: false;

    })
    .catch(function(error){
      controller.no_dashboard = true;
    });
  };

  $scope.showDashboard = function(){
    controller.dashboard_selected = true;
    controller.dashboardSelected = $scope.item;
    controller.widget_list = [];

 //Load the dashboards' wodgets
    Widgets.get(controller.dashboardSelected.id)
    .success(function(result){
      var i = 0;
      var current_list = result;
      var current;
      for(i; i < current_list.length; i += 1){
        current = current_list[i];
        controller.widget_list.push({
          sizeX : current.position.width,
          sizeY : current.position.height,
          col : current.position.col,
          row : current.position.row,
          name : current.name,
          template : '<first-widget></first-widget>'
        });
      }
    });

  };

  $scope.createDashboard = function(){
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
    .error(function(a,b){
    });
  };

  var changeValue = function(data){
    controller.dashboardSelected = data;
    $scope.item = data;
    $scope.showDashboard();
  };

  init();

});
