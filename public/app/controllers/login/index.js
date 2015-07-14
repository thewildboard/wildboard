'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:LoginIndexCtrl
 * @description
 * # LoginIndexCtrl
 * Controller of the dashboardApp
 */
angular.module("dashboardApp")
  .controller('LoginIndexCtrl', function ($location, $scope, $auth) {
    var vm = this;

    this.login = function(){
        $auth.login({
            username: vm.username,
            password: vm.password
        })
        .then(function(){
          console.log($auth.getToken());
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
