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
  .controller('LogoutCtrl', function ($location, Authentication, $cookies) {
    this.logout = function(){
      Authentication.logout().then(function(){
        Authentication.logged();
      });
    };
  });
}());
