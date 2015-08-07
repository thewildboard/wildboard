(function(){
  'use strict';
  angular.module('widgetsApp')
  .directive('firstWidget', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/scripts/modules/widgets/directives/firstWidget.html'
    };
  });
}());
