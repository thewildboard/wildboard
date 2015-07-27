'use strict';
angular.module('dashboardApp')
  .directive('loadingValue', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/views/directives/loadingValue.html'
    };
  });
