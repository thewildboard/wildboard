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
  .controller('LoginIndexCtrl', ['Providers', '$scope', '$location', '$auth', 'Authentication', function (Providers, $scope, $location, $auth, Authentication) {
    var ctrl = this;
    ctrl.providers = [];

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

  this.loadproviders = function(){
    Providers.all()
    .then(function(){
      Providers.generateButtonList(Providers.getProvidersData());
      ctrl.providers = Providers.getButtonList();
    });
  };

}]);
}());
