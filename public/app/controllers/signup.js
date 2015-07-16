'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:LoginIndexCtrl
 * @description
 * # LoginIndexCtrl
 * Controller of the dashboardApp
 */
angular.module("dashboardApp")
  .controller('SignupIndexCtrl', function ($rootScope, $location, $scope, $auth, Authentication) {
    var ctrl = this;

    this.signup = function(){
        Authentication.signup(ctrl)
        .then(function(data){
            $location.path("/about")
        })
        .catch(function(error){
          ctrl.username = '';
          ctrl.password = '';
          ctrl.email = '';
          $scope.message = error.message;
        });
    };

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
