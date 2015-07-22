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
    $scope.showModal = !$scope.showModal;
  };

  controller.dashboard_list = function(){
    DashboardActions.dashboardList()
    .then(function(result){
      controller.dashboardList = result.data;
      controller.no_dashboard = false;
    })
    .catch(function(error){
      controller.no_dashboard = true;
    });
  };

  $scope.showDashboard = function(){
    controller.dashboard_selected = true;
    controller.dashboardSelected = $scope.item;
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
