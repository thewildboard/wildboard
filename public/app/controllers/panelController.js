angular.module('dashboardApp').
controller('panelController', function ($scope) {
  this.tab = 1;
  this.selectTab = function(setTab){
    this.tab = setTab;
  }

  this.isSelected = function(checkTab){
    return this.tab === checkTab;
  }
  this.jumpToInvalidTab=function(){
    this.tab = 1;
    if(this.data_form.$valid){
      this.tab = 2;
    }
  };
});
