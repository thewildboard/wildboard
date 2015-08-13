(function(){
  'use strict';
  angular.module('boardsApp')
  .directive('dashboardPanel', function () {
    return {
      templateUrl: 'app/scripts/modules/dashboards/directives/dashboardPanel.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
      },
      controller : 'dashboardPanelCtrl',
      controllerAs: 'dashboardpanel'
    };
  });
}());
