'use strict';
angular.module('dashboardApp')
.directive('dashboardPanel', function () {
    return {
      templateUrl: 'app/views/directives/dashboardPanel.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
      },
      controller : 'gridsterCtrl',
      controllerAs: 'gridster'
    };
  });
