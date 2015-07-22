'use strict';

var app = angular
.module("dashboardApp", [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  "ngRoute",
  'ngSanitize',
  'satellizer',
  'ui.router',
  'gridster',
  'ui.bootstrap'

])
.config(function($authProvider) {


  $authProvider.google({
    clientId: '176660184367-ivsogvjqqdv24a5l68ljds0v1h4qkutj.apps.googleusercontent.com',
    responseType: 'token'
  });
})
.config(['$httpProvider', 'satellizer.config', function($httpProvider, config) {
    $httpProvider.interceptors.push(['$q', function($q) {
      var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
      return {
        request: function(httpConfig) {
          var token = localStorage.getItem(tokenName);
          if (token && config.httpInterceptor) {
            token = config.authHeader === 'Authorization' ? 'Bearer ' + token : token;
            httpConfig.headers[config.authHeader] = token;
          }
          return httpConfig;
        },
        responseError: function(response) {
          return $q.reject(response);
        }
      };
    }]);
  }]);
