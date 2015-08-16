(function(){
  'use strict';

  angular.module('dashboardApp')
  .factory('Providers', ['$http', 'MY_CONFIG', function ProvidersFactory($http, MY_CONFIG){
    var providerList = [];
    var providers_data;
    var buttonlist = [];

    var getProviderList = function(){
      return providerList;
    };

    var getButtonList = function(){
      return buttonlist;
    };

    var getProvidersData = function(){
      return providers_data;
    };

    var generateButtonList = function(){
      var i = 0;
      var data = getProvidersData();
      var current;
      buttonlist = [];
      for (i; i < data.length ; i += 1){
        current = data[i];
        if(current.auth){
          buttonlist.push({
            name : current.name,
            authorization_url : current.auth.oauth2.authorization_url,
            token_url : current.auth.oauth2.token_url
          });
        }
      }
    };

    var all = function(values){
      return $http.get(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers')
      .then(function(result){
        providers_data = result.data;
      });
    };

    var generate_providerList = function(data){
      var i = 0;
      var length = data.length;
      var sources;
      var provider;
      var source;
      var provider_source_list;
      providerList = [];
      for (i; i < length; i+=1) {
        provider_source_list = [];
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
    };

    /** this function is used to load the porvider list in order of get the source data**/
    var get = function(){
      return all()
      .then(function(){
        generate_providerList(getProvidersData());
      })
      .catch(function(err){
      });
    };

    return {
      get : get,
      all : all,
      getProviderList : getProviderList,
      _generate_providerList : generate_providerList,
      generateButtonList : generateButtonList,
      getButtonList : getButtonList,
      getProvidersData : getProvidersData
    };
  }]);
}());
