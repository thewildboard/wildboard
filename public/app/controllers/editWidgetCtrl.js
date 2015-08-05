angular.module('dashboardApp').
controller('editWidgetCtrl', function ($scope, $modalInstance, items) {


  $scope.widget_edit_name = items.data.name;

  $scope.ok = function () {
    $modalInstance.close($scope.widget_edit_name);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
