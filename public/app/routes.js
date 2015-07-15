'use strict';
angular.module("dashboardApp")

.config(function($routeProvider, $authProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    // Parametros de configuración
    $authProvider.loginUrl = "https://localhost:3000/login";
    $authProvider.signupUrl = "https://localhost:3000/signup";
    $authProvider.tokenName = "success";
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

    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "app/views/pages/home.html",
            controller: "mainController",
            controllerAs: "main"
        })
        .state("login", {
            url: "/login",
            templateUrl: 'app/views/login/index.html',
            controller: 'LoginIndexCtrl',
            controllerAs: 'login'
        })
        .state("signup", {
            url: "/signup",
            templateUrl: 'app/views/signup/index.html',
            controller: 'SignupIndexCtrl',
            controllerAs: 'signup'
        })
        .state("logout", {
            controller: 'LogoutCtrl',
            controllerAs: 'logout'
        })
        .state("about", {
            url: "/about",
            templateUrl: 'app/views/pages/about.html',
            controller: 'aboutCtrl',
            controllerAs: 'about',
            resolve : {
              authenticated : authenticated
            }
        })
        .state("otherwise", {
          url : '/'
        });
});
