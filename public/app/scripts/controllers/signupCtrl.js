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
  .controller('SignupIndexCtrl', ['$location', '$scope', 'Authentication', function ($location, $scope, Authentication) {
    var ctrl = this;

    this.signup = function(){
      Authentication.signup(ctrl)
      .then(function(data){
        Authentication.logout().then(function(){
          Authentication.login(ctrl).then(function(){
            $location.path("/");
          });
        });
      })
      .catch(function(error){
        ctrl.username = '';
        ctrl.password = '';
        ctrl.email = '';
        $scope.message = error.message;
      });
    };
  }]);
}());
