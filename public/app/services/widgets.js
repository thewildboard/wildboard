'use strict';

angular.module('dashboardApp')
.factory('Widgets', function WidgetsFactory($http, MY_CONFIG){
  // temporary object
  var myObject = {
    get : function(dashboard_id){
      return $http
      .get(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/' + dashboard_id + '/widgets');
    },
    create : function(data, dashboard_id){
      return $http.post(
        MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/' + dashboard_id + '/widgets',
        data
      );
    }
  };
  return myObject;
});
