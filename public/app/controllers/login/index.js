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

    console.log(this, $scope);
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
      .then(function(data){
        console.log('pasa ppr qio')
        console.log($auth.getToken());
      }
      );
    };

    this.login = function(){
        $auth.login({
            username: vm.username,
            password: vm.password
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
