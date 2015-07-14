'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:LoginIndexCtrl
 * @description
 * # LoginIndexCtrl
 * Controller of the dashboardApp
 */
angular.module("dashboardApp")
  .controller('SignupIndexCtrl', function ($location, $scope, $auth) {
    var vm = this;

    console.log(this, $scope);

    this.signup = function(){
        $auth.signup({
            username: vm.username,
            password: vm.password,
            email : vm.email
        })
        .then(function(){
            $location.path("/")
        })
        .catch(function(response){
        });
    };

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
