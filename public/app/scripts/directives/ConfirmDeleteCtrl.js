(function(){
  angular.module('dashboardApp').
  controller('ConfirmDeleteCtrl', function ($scope, $modalInstance, items) {

    $scope.element_name = items.name;
    $scope.element = items.element;
    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
}());
