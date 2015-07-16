angular.module('dashboardApp')
  .controller('gridsterCtrl', function($rootScope, $scope) {
    var vm = this;

    $scope.standardItems = [
      // { sizeX: 2, sizeY: 2, row: 0, col: 0, template: "<first-widget></first-widget>" },
      // { sizeX: 2, sizeY: 2, row: 0, col: 2, template: "<first-widget></first-widget>" },
    ];

    $scope.addWidget = function(type) {
      var newWidget = { sizeX: 2, sizeY: 2, row: 0, col: 0, template: "<" + type + "-widget></" + type + "-widget>" };
      $scope.standardItems.push(newWidget);
      //checkPositions();
    };

    $scope.deleteWidget = function($index) {
      $scope.standardItems.splice($index, 1);
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

    // var positionsArray = [];

    // function checkWindowSize() {
    //   var width = $(window).width();
    //   if (positionsArray.length === 0 && width < 800 && $scope.standardItems.length > 0){
    //     storePositions();
    //   }
    //   if (width < 800) {
    //     vm.gridsterOpts.columns = 4;

    //     $scope.standardItems.forEach(function (item, index) {
    //       item.row = index*2;
    //     });
    //   } else {
    //     vm.gridsterOpts.columns = 8;
    //     $scope.standardItems.forEach(function (item, index) {
    //       if (positionsArray.length > 0) {
    //         item.row = positionsArray[index][0];
    //         item.col = positionsArray[index][1];
    //       }
    //     });
    //     positionsArray = [];
    //   }
    // }

    // checkWindowSize();
    // window.addEventListener("resize", checkWindowSize);


    // var checkPositions = function() {
    //   $scope.standardItems.forEach(function (item, index) {
    //     console.log("WIDGET " + index + " = ROW: " + item.row + " COL: " + item.col);
    //   });
    // };

    // $scope.$watch('standardItems', function(items){
    //    // one of the items changed
    //    checkPositions();
    // }, true);

    // var storePositions = function() {
    //   $scope.standardItems.forEach(function (item, index) {
    //     positionsArray.push([item.row, item.col]);
    //   });
    //   console.log(positionsArray);
    // };
});
