'use strict';

angular.module('dashboardApp')
.factory('Providers', function ProvidersFactory($http, MY_CONFIG){
  // temporary object
  var myObject = {
    get : function(values){
      return $http.get(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers');
    }
  };
  return myObject;
});
