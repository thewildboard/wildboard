(function(){
  'use strict';
  angular.module("dashboardApp")
  .run(['$rootScope', '$location', 'Authentication', '$auth', function ($rootScope, $location, Authentication, $auth) {
    $rootScope.$on('$routeChangeStart', function (event) {
      var authenticated = Authentication.isAuthenticated();
      if (authenticated) {
        event.preventDefault();
        $location.path('/login');
      }
      else {
        event.preventDefault();
        $location.path('/');
      }
    });
  }])

  .config(['MY_CONFIG', '$authProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider',
    function(MY_CONFIG, $authProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    // Parametros de configuración
    $authProvider.loginUrl = MY_CONFIG.url + ':' + MY_CONFIG.port + '/user/login';
    $authProvider.signupUrl = MY_CONFIG.url + ':' + MY_CONFIG.port + '/user/signup';
    $authProvider.tokenName = "message";
    $authProvider.tokenPrefix = "dashboard";
    //$urlRouterProvider.otherwise('/');



    $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "app/pages/dashboard.html",
      controller: "dashboardCtrl",
      controllerAs: "dashboard"
    })
    .state("login", {
      url: "/login",
      templateUrl: 'app/pages/login.html',
      controller: 'LoginIndexCtrl',
      controllerAs: 'login'
    })
    .state("signup", {
      url: "/signup",
      templateUrl: 'app/pages/signup.html',
      controller: 'SignupIndexCtrl',
      controllerAs: 'signup'
    })
    .state("logout", {
      controller: 'LogoutCtrl',
      controllerAs: 'logout'
    })
    .state("otherwise", {
      url : '/'
    });

    $locationProvider.html5Mode(true);
  }]);
}());
