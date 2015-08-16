(function(){
  'use strict';
  angular.module('widgetsApp')
  .directive('numberTemplate', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/scripts/modules/widgets/directives/numberTemplate.html'
    };
  });
}());
