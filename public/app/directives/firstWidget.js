'use strict';
angular.module('dashboardApp')
  .directive('firstWidget', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/views/directives/firstWidget.html'
    };
  });
