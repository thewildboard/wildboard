angular.module('dashboardApp').
controller('panelController', function ($scope) {
  var controller = this;
  controller.tab = 1;
  controller.colorSelected = 0;
  $scope.gridster.colorSelected = 0;

  controller.selectTab = function(setTab){
    controller.tab = setTab;
  };

  controller.isSelected = function(checkTab){
    return controller.tab === checkTab;
  };

  controller.isColorSelected = function(image){
    return controller.colorSelected === image;
  };

  controller.selectColor = function(color){
    controller.colorSelected = color;
    $scope.gridster.colorSelected = color;
  };

});
