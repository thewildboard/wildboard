angular.module('dashboardApp').
controller('editWidgetCtrl', function ($scope, $modalInstance, items) {

  $scope.gridster = items.gridster; // esto lo uso para estar en el mismo ambito que gridster y coger bien los datos
  $scope.widget = items.data;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
