'use strict';
angular.module("dashboardApp")

.config(function($routeProvider, $authProvider, $stateProvider, $locationProvider) {
    // Parametros de configuración
    $authProvider.loginUrl = "https://localhost:3000/login";
    $authProvider.signupUrl = "https://localhost:3000/signup";
    $authProvider.tokenName = "success";
    $authProvider.tokenPrefix = "";


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
        .state("about", {
            url: "/about",
            emplateUrl: 'app/views/pages/about.html',
            controller: 'aboutCtrl',
            controllerAs: 'about'
        });
      //$locationProvider.html5Mode(true);
});
