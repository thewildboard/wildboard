angular.module('dashboardApp').
controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.dashboard_name = items;
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
