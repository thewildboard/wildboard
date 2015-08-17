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
  .controller('LoginIndexCtrl', ['$scope', '$location', '$auth', 'Authentication', 'Providers', 'MY_CONFIG', '$window',
  function ($scope, $location, $auth, Authentication, Providers, MY_CONFIG, $window) {
    var ctrl = this;
    ctrl.providers = [];

    this.redirectToProvider = function(){
      $window.open(MY_CONFIG.url + ':' + MY_CONFIG.port + '/user/auth', '_self');
    };

    this.login = function(){
      Authentication.login(ctrl)
      .then(function(data){
        Authentication.logged();
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
