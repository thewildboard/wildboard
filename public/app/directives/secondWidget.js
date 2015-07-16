'use strict';
angular.module('dashboardApp')
  .directive('secondWidget', function() {
    return {
      restrict: 'E',
      scope: {
        info: '='
      },
      templateUrl: 'app/views/directives/secondWidget.html'
    };
  });
