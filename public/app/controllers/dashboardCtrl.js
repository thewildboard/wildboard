'use strict';
angular.module('dashboardApp')
.controller('dashboardCtrl', function ($scope, $http, DashboardList) {
  var controller = this;
  controller.dashboard_selected = null;
  controller.dashboardList = [];
  controller.dashboardSelected = null;
  $scope.showModal = false;

  $scope.toggleModal = function(){
    $scope.showModal = !$scope.showModal;
  };

  DashboardList.dashboardList()
  .success(function(data){
    controller.dashboardList = data;
    controller.no_dashboard = false;
  })
  .error(function(a, b, c){
    console.log(a, b, c);
    controller.no_dashboard = true;
  });;

  controller.showDashboard = function(){
    controller.dashboard_selected = true;
    controller.dashboardSelected = $scope.item;
  };

  controller.createDashboard = function(){
    $http.post('https://localhost:3000/api/boards', {
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
    controller.showDashboard();
  };

});
