(function(){
  'use strict';
  angular.module('dashboardApp')
  .factory('Authentication', ['$auth', function AuthenticationFactory($auth){
    // temporary object
    var myObject = {
      login : function(values){
        return $auth.login({
          username: values.username,
          password: values.password
        });
      },
      signup : function(values){
        return $auth.signup({
          username: values.username,
          password: values.password,
          email : values.email
        });
      },
      logout : function(){
        return $auth.logout();
      }
    };
    return myObject;
  }]);
}());
