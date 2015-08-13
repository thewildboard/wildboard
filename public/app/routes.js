(function(){
  'use strict';
  angular.module("dashboardApp")

  .config(function(MY_CONFIG, $routeProvider, $authProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    // Parametros de configuración
    $authProvider.loginUrl = MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/login';
    $authProvider.signupUrl = MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/signup';
    $authProvider.tokenName = "message";
    $authProvider.tokenPrefix = "dashboard";
    //$urlRouterProvider.otherwise('/');

    var authenticated = ['$q', '$location', '$auth', function($q, $location, $auth) {
      var deferred = $q.defer();
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }];

    var no_authenticated = ['$q', '$location', '$auth', function($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        $location.path('/');
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }];

    $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "app/pages/dashboard.html",
      controller: "dashboardCtrl",
      controllerAs: "dashboard",
      resolve : {
        authenticated : authenticated
      }
    })
    .state("login", {
      url: "/login",
      templateUrl: 'app/pages/login.html',
      controller: 'LoginIndexCtrl',
      controllerAs: 'login',
      resolve : {
        authenticated : no_authenticated
      }
    })
    .state("signup", {
      url: "/signup",
      templateUrl: 'app/pages/signup.html',
      controller: 'SignupIndexCtrl',
      controllerAs: 'signup',
      resolve : {
        authenticated : no_authenticated
      }
    })
    .state("logout", {
      controller: 'LogoutCtrl',
      controllerAs: 'logout'
    })
    .state("otherwise", {
      url : '/'
    });

    $locationProvider.html5Mode(true);
  });
}());
