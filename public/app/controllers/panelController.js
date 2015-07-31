angular.module('dashboardApp').
controller('panelController', function ($scope) {

  var controller = $scope.gridster;
  controller.tab = 1;
  controller.image_selected = 1;
  controller.colorSelected = 0;

  controller.selectTab = function(setTab){
    controller.tab = setTab;
  };

  controller.isSelected = function(checkTab){
    return controller.tab === checkTab;
  };

  controller.isImageSelected = function(image){
    return controller.colorSelected === image;
  };

  controller.selectImage = function(color){
    controller.colorSelected = color;
  };

  controller.selectColor = function(color){
    controller.colorSelected = color;
  };

});
