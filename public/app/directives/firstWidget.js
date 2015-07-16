'use strict';
app.directive('firstWidget', function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    templateUrl: 'app/views/directives/firstWidget.html'
  };
});
