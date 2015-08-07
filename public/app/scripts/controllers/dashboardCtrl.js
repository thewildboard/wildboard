(function(){
  'use strict';
  angular.module('dashboardApp')
  .controller('dashboardCtrl', function ($scope, $http, DashboardsApi, Dashboards, Widgets, WidgetsApi,  ngFoobar, $modal, $log) {
    var controller = this;
    $scope.showModal = false;
    $scope.item = {};

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    controller.showDashboard = function(){
      Dashboards.setCurrentDashboard($scope.item);
      Dashboards.load_and_show_widgets($scope.item.id).then(function(){
        controller.widget_list = Dashboards.getWidgetList();
      });
    };

    $scope.$on('update_widget_list', function(){
      controller.widget_list = Dashboards.getWidgetList();
    })

    /**
    Here we list all dashboard that the user have created
    and if there is some then we automatically we select the first one
    **/
    controller.dashboard_list = function(){
      Dashboards.dashboard_list()
      .then(function(){
        controller.dashboardList = Dashboards.getDashboardList();
        $scope.item = Dashboards.getCurrentDashboard();
        if ($scope.item.id) {
          controller.showDashboard();
        }
        else{
          ngFoobar.show("warning", "There no are any dashboard associated to this account");
        }
      })
      .catch(function(error){
      });

    };

    controller.delete = function(){
      Dashboards.delete({element_name : 'dashboard', element : $scope.item})
      .then(function(){
        controller.dashboard_list();
      })
      .catch(function(){
      });
    };
    /**
    This function is used to decide if show the create_dashboard form
    **/
    $scope.toggleModal = function(){
      controller.name = '';
      $scope.showModal = !$scope.showModal;
    };

    /**
    This function is used to create a new dashboard.
    **/
    controller.createDashboard = function(){
      var json = {
        name : controller.name,
        owner : 'me'
      };
      Dashboards.create(json)
      .then(function(){
        $scope.showModal = false;
        controller.name = '';
        setTimeout(function(){
          $scope.item = Dashboards.getCurrentDashboard();
          controller.showDashboard();
        }, 0);
      })
      .catch(function(){
        $scope.showModal = false;
        controller.name = '';
        alert("error");
      });
    };
  });
}());
