(function(){
  'use strict';
  angular.module('dashboardApp')
  .factory('Authentication', ['$auth', '$http', 'MY_CONFIG', function AuthenticationFactory($auth, $http, MY_CONFIG){
    // temporary object
    var authenticated = false;

    var login =  function(values){
      return $auth.login({
        username: values.username,
        password: values.password
      });
    };
    var signup = function(values){
      return $auth.signup({
        username: values.username,
        password: values.password,
        email : values.email
      });
    };
    var logout =  function(){
      return $http.get(MY_CONFIG.url + ':' + MY_CONFIG.port + '/user/logout');
    };
    var logged = function(){
      return $http.get(MY_CONFIG.url + ':' + MY_CONFIG.port + '/user/logged')
      .then(function(result){
        authenticated = result.data;
      });
    };
    var isAuthenticated = function($q){
      return authenticated;
    };

    return {
      login :login,
      signup : signup,
      logout : logout,
      logged : logged,
      isAuthenticated : isAuthenticated
    };
  }]);
}());
