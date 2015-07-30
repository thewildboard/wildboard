angular.module('dashboardApp').
controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.dashboard_name = items.name;
  $scope.element = items.element;
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
