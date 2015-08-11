(function(){
  'use strict';

  angular.module('dashboardApp')
  .factory('Providers', function ProvidersFactory($http, MY_CONFIG){

    var providerList = [];

    var getProviderList = function(){
      return providerList;
    };

    var all = function(values){
      return $http.get(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers');
    };

    /** this function is used to load the porvider list in order of get the source data**/
    var get = function(){
      return all()
      .then(function(result){
        var i = 0;
        var data = result.data;
        var length = data.length;
        var sources;
        var provider;
        var source;
        var provider_source_list;
        providerList = [];
        for (i; i < length; i+=1) {
          provider_source_list = []
          provider = {
            name : data[i].name,
            sources : provider_source_list
          };
          providerList.push(provider);
          sources = data[i].sources;
          for(source in sources){
            provider_source_list.push(sources[source]);
          }
        }
      })
      .catch(function(err){

      });
    };
    return {
      get : get,
      all : all,
      getProviderList : getProviderList
    };
  });
}());
