'use strict';
angular.module('dashboardApp')
.directive('editWidget', function () {
    return {
      templateUrl: 'app/views/directives/editWidget.html',
      restrict: 'E'
    };
  });
