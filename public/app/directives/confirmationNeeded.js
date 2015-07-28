angular.module('dashboardApp')
.directive('confirmationNeeded', function () {
    return {
    priority: 1,
    link: function (scope, element, attr) {
      var element_id = attr.dashboardid
      console.log(element_id)
      var msg = attr.confirmationNeeded.replace('$1', element_id);
      var clickAction = attr.ngClick;
      element.bind('click',function (e) {
        if (window.confirm(msg)){
          scope.$eval(clickAction + '()');
        }
        e.stopImmediatePropagation();
        e.preventDefault();
       });
     }
    };
});
