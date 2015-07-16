angular.module('dashboardApp')
  .controller('gridsterCtrl', function($rootScope, $scope) {
    var vm = this;

    $scope.standardItems = [
      { sizeX: 2, sizeY: 2, row: 0, col: 0, template: "<first-widget></first-widget>" },
      { sizeX: 2, sizeY: 2, row: 0, col: 2, template: "<first-widget></first-widget>" },
    ];

    function myFunction() {
      var width = $(window).width();
      if (width < 800) {
        vm.gridsterOpts.columns = 4;

        vm.standardItems.forEach(function (item, index) {
          item.row = index*2;
        });
      } else {
        vm.gridsterOpts.columns = 8;
      }
    }

    window.addEventListener("resize", myFunction);

    $scope.addWidget = function(type) {
      var newWidget = { sizeX: 2, sizeY: 2, row: 0, col: 0, template: "<" + type + "-widget></" + type + "-widget>" };
      $scope.standardItems.push(newWidget);
    };

    vm.gridsterOpts = {
      columns: 8, // the width of the grid, in columns
      swapping: true, // whether or not to have items switch places instead of push down if they are the same size
      width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
      margins: [4, 4], // the pixel distance between each widget
      outerMargin: false,
      mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      resizable: {
         enabled: false,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         start: function(event, $element, widget) {}, // optional callback fired when resize is started,
         resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
         stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
      }
    };
});