'use strict';
angular.module('dashboardApp')
.directive('createDashboard', function () {
    return {
      templateUrl: 'app/views/directives/createDashboardModal.html',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
        scope.$watch(attrs.visible, function(value){
          if(value) {
            $(element).modal('show');
          } else {
            $(element).modal('hide');
          }
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
