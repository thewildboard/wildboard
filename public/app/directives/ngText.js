'use strict';
angular.module('dashboardApp')
  .directive('ngText', function() {
    return {
      restrict: 'A',
      link : function (scope, element, attrs) {
        element.text(attrs.ngText)
      }
    };
  });
