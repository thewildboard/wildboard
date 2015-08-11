(function(){
  'use strict';
  angular.module('dashboardApp')
  .directive('loadingValue', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/scripts/directives/loadingValue.html'
    };
  });
}());
