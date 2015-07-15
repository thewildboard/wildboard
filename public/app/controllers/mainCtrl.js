'use strict';

angular.module("dashboardApp")

.controller("mainController", function($scope, $auth) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
  var vm = this;

  vm.message = "Test Message!";

});
