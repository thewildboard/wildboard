(function(){
  'use strict';

  angular.module('widgetsApp')
  .factory('WidgetsApi', function WidgetsApiFactory($http, MY_CONFIG){
    // temporary object

    /********************  APIS CALLS  **************************/
    var service = {

      post : function(values){
        return $http.post(
          MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/' + values.dashboard_id + '/widgets',
          values.data
        );
      },
      update : function(values){
        return $http(
          {
            method : 'PATCH',
            url : MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/widgets/' + values.widget_id,
            data : values.data
          }
        );
      },
      delete : function(widget_id){
        return $http.delete(
          MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/widgets/' + widget_id
        );
      },
      get : function(widget_id){
        return $http.get(
          MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/widgets/' + widget_id
        );
      }};

      return service;
    });
  }());
