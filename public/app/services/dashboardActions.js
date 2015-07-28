/*global angular:true, moment:true, _:true */

  'use strict';

  angular.module('dashboardApp')
  .factory('DashboardActions', function DashboardActionsFactory($http, MY_CONFIG){
    var myObject = {
      dashboardList : function(force){
          return $http({
            method: 'GET',
            url: MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards'
          });
      },
      dashboardCreate : function(data){
        return $http.post(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards', data);
      },
      delete : function(dashboard_id){
        return $http.delete(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/' + dashboard_id);
      }
    };
    return myObject;
  });
