'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:LoginIndexCtrl
 * @description
 * # LoginIndexCtrl
 * Controller of the dashboardApp
 */

angular.module("dashboardApp")
  .controller('LoginIndexCtrl', function ($rootScope, $location, $scope, $auth, $state, $q, Authentication) {
    var ctrl = this;

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
      .then(function(data){
        $location.path('/');
      }
      );
    };

    this.login = function(){
      Authentication.login(ctrl)
      .then(function(data){
        $location.path('/');
      })
      .catch(function(error){
        ctrl.username = '';
        ctrl.password = '';
        ctrl.message = error.data.message;
      });
    };


    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
