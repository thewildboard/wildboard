'use strict';
app.directive('secondWidget', function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    templateUrl: 'app/views/directives/secondWidget.html'
  };
});
