(function(){
  'use strict';
  angular.module('boardsApp')
  .factory('DashboardsApi', ['$http', 'MY_CONFIG', function DashboardApiFactory($http, MY_CONFIG){
    var myObject = {
      all : function(force){
        return $http({
          method: 'GET',
          url: MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards'
        });
      },
      post : function(data){
        return $http.post(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards', data);
      },
      delete : function(dashboard_id){
        return $http.delete(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/' + dashboard_id);
      },
      allWidgets : function(dashboard_id){
        return $http.get(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/' + dashboard_id + '/widgets');
      }
    };
    return myObject;
  }]);
}());
