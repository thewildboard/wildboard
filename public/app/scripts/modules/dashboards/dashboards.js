(function(){
  'use strict';
  angular.module('boardsApp')
  .factory('Dashboards', function WidgetsFactory($modal, $http, MY_CONFIG, WidgetsApi, DashboardsApi){

    var dashboardList = [];
    var thereIsDashboardSelected = false;
    var currentDashboard = {};
    var widgetsObjectList = {};
    var widgetList = [];

    /**
    aux_function used to get all the values of an object
    **/
    var getCollection = function(obj){
      var i;
      var result = [];
      for (i in obj){
        result.push(obj[i]);
      }
      return result;
    };

    var getCurrentDashboard = function(){
      return currentDashboard;
    };

    var setCurrentDashboard = function(dashboard){
      currentDashboard = dashboard;
    };

    var getWidgetList = function(){
      return getCollection(widgetsObjectList);
    };

    var setWidgetsObjectList = function(key, value){
      widgetsObjectList[key] = value;
    };

    var deleteWidgetsObjectList = function(key){
      delete widgetsObjectList[key];
    };

    var getDashboardList = function(){
      return dashboardList;
    };

    var clean_dashboard_values = function(){
      dashboardList = [];
      thereIsDashboardSelected = false;
      currentDashboard = {};
      widgetsObjectList = {};
    };

    /**
    Here we list all dashboard that the user have created
    and if there is some then we automatically we select the first one
    **/
    var dashboard_list = function(){
      dashboardList = [];
      currentDashboard = {};
      return DashboardsApi.all()
      .then(function(result){
        dashboardList = result.data;
        if(dashboardList.length >= 1){
          currentDashboard = dashboardList[0];
        }
      })
      .catch(function(error){
        controller.no_dashboard = true;
      });
    };

    /**
    this function is used to load all the widget of a specific dashboard and create the structure needed to the
    correct visualization
    **/
    var load_and_show_widgets = function(dashboard_id){
      widgetsObjectList = {};
      return DashboardsApi.allWidgets(dashboard_id)
      .success(function(result){
        var i = 0;
        var current_list = result;
        var current;
        for(i; i < current_list.length; i += 1){
          current = current_list[i];
          widgetsObjectList[current.id] = {
            sizeX : current.position.width,
            sizeY : current.position.height,
            col : current.position.col,
            row : current.position.row,
            template : '<first-widget></first-widget>',
            data : current
          };
        }
      });
    };
    /**
    This function is used to create a new dashboard.
    **/
    var create = function(json){
      return DashboardsApi.post(json)
      .then(function(result){
        dashboardList.push(result.data);
        currentDashboard = result.data;
      });
    };

    var delete_ = function(data){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/scripts/directives/confirmDelete.html',
        controller: 'ConfirmDeleteCtrl',
        size: 'md',
        resolve: {
          items: function () {
            return {
              element : data.element_name,
              name : data.element.name
            };
          }
        }
      });
      return modalInstance.result.then(function (selectedItem) {
        DashboardsApi.delete(data.element.id);
      });
    };

    return {
      dashboard_list : dashboard_list,
      getCurrentDashboard : getCurrentDashboard,
      getDashboardList : getDashboardList,
      load_and_show_widgets : load_and_show_widgets,
      create : create,
      setWidgetsObjectList : setWidgetsObjectList,
      getWidgetList : getWidgetList,
      deleteWidgetsObjectList : deleteWidgetsObjectList,
      delete : delete_,
      setCurrentDashboard  : setCurrentDashboard
    };
  });
}());
