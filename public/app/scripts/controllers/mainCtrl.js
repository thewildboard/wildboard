(function(){
  'use strict';

  /**
  * @ngdoc function
  * @name dashboardApp.controller:LoginIndexCtrl
  * @description
  * # LoginIndexCtrl
  * Controller of the dashboardApp
  */

  angular.module('dashboardApp')
  .controller('mainCtrl', ['$auth', '$scope', '$location', 'Authentication',
  function ($auth, $scope, $location, Authentication) {
    Authentication.logged();
    $scope.$watch(Authentication.isAuthenticated, function (value, oldValue) {
      if(!value) {
        $location.path('/login');
      }
      else {
        $location.path('/');
      }
    }, true);
  }]);
}());
