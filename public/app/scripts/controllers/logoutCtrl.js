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
  .controller('LogoutCtrl', ['$location', 'Authentication', function ($location, Authentication) {
    var ctrl = this;
    this.logout = function(){
      Authentication.logout().then(function(){
        Authentication.logged();
      });
    };
  }]);
}());
