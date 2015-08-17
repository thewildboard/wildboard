(function(){
  'use strict';
  angular.module('widgetsApp')
  .directive('createWidget', [function () {
    return {
      templateUrl: 'app/scripts/modules/widgets/directives/createWidget.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
        var ctrl = scope.create_widget_ctrl;
        scope.tab = ctrl.tab;
        scope.colorSelected = ctrl.colorSelected;

        scope.selectTab = function(setTab){
          scope.tab = setTab;
          ctrl.tab = setTab;
        };
        scope.isSelected = function(checkTab){
          return ctrl.tab === checkTab;
        };
        scope.isColorSelected = function(color){
          return ctrl.colorSelected === color;
        };
        scope.selectColor = function(color){
          ctrl.colorSelected = color;
          scope.colorSelected = color;
        };
      }
    };
  }]);
}());
