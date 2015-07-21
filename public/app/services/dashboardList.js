/*global angular:true, moment:true, _:true */

  'use strict';

  angular.module('dashboardApp')
  .factory('DashboardList', function DashboardListFactory($http){
    var myObject = {
      dashboardList : function(force){
          return $http({
            method: 'GET',
            url: 'https://localhost:3000/api/boards'
          });
      }
    };
    return myObject;
  });
