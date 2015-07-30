'use strict';
angular.module('dashboardApp')
.directive('createWidget', function () {
    return {
      templateUrl: 'app/views/directives/createWidget.html',
      restrict: 'E',
      /*scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
      }*/
    };
  });
