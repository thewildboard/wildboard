'use strict';
angular.module('dashboardApp')
.directive('dashboard', function () {
    return {
      templateUrl: 'app/views/directives/dashboard.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
      }
    };
  });
